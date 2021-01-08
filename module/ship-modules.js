Hooks.once("init", () => {
  game.settings.register("FoundryVTT-starfinder-houserules-raavi", "modList", {
    scope: "world",
    config: false,
    default: []
  })
});


Hooks.on(`renderActorSheet`, (app, html, data) => {
  addModulesTab(app, html, data).then(function () {
    if (app.activateModulesTab) {
      app._tabs[0].activate("modules");
    }
  });
});

async function addModulesTab(app, html, data) {
  if (data.isShip) {
	let actor = game.actors.entities.find((a) => a.data._id === data.actor._id);

	let modulesTabBtn = $('<a class="item" data-tab="modules">Modules</a>');
	let tabs = html.find('.tabs[data-group="primary"]');

	if(!(tabs.find('.item[data-tab="modules"]').length)) { //Prevent addition of tab more than once
		tabs.append(modulesTabBtn);
	}
	if (actor.data.data.attributes.highModules === undefined || actor.data.data.attributes.highModules === null) {
		actor.data.data.attributes.highModules = 0;
	}

	if (actor.data.data.attributes.midModules === undefined || actor.data.data.attributes.midModules === null) {
		actor.data.data.attributes.midModules = 0;
	}

	if (actor.data.data.attributes.lowModules === undefined || actor.data.data.attributes.lowModules === null) {
		actor.data.data.attributes.lowModules = 0;
	}

	if (actor.data.data.attributes.intModules === undefined || actor.data.data.attributes.intModules === null) {
		actor.data.data.attributes.intModules = 0;
	}

    if (
      actor.data.flags["FoundryVTT-starfinder-houserules-raavi"] === undefined ||
      actor.data.flags["FoundryVTT-starfinder-houserules-raavi"] === null
    ) {
      await actor.setFlag("FoundryVTT-starfinder-houserules-raavi", "modList", []);
    }


	let flags = actor.getFlag("FoundryVTT-starfinder-houserules-raavi", "modList");

	let sheet = html.find(".sheet-body");

	let modulesTabHtml = $(
      await renderTemplate(
        "modules/FoundryVTT-starfinder-houserules-raavi/templates/modules-section.html",
        {
		  modules: flags,
          data: actor.data.data
        }
      )
    );

	let modulesHTML = await compileModulesTab(modulesTabHtml, sheet);

    modulesHTML.find(".highmodule-add").click(async (event) => { generateModuleOnClick(event, html, app, actor, 1); });
	modulesHTML.find(".midmodule-add").click(async (event) => { generateModuleOnClick(event, html, app, actor, 2); });
	modulesHTML.find(".lowmodule-add").click(async (event) => { generateModuleOnClick(event, html, app, actor, 3); });
	modulesHTML.find(".intmodule-add").click(async (event) => { generateModuleOnClick(event, html, app, actor, 4); });

    modulesHTML.find(".module-delete").click(async (event) => {
      event.preventDefault();

      // Set up some variables
      let fieldId = event.currentTarget.id;
      let moduleId = parseInt(fieldId.replace("module-delete-", ""));
      let del = false;
      let dialogContent = await renderTemplate(
        "modules/FoundryVTT-starfinder-houserules-raavi/templates/delete-module-dialog.html"
      );

      // Create dialog
      new Dialog({
        title: `Delete Module`,
        content: dialogContent,
        buttons: {
          yes: {
            icon: "<i class='fas fa-check'></i>",
            label:"Delete",
            callback: () => (del = true),
          },
          no: {
            icon: "<i class='fas fa-times'></i>",
            label: "Cancel",
            callback: () => (del = false),
          }
        },
        default: "yes",
        close: async (html) => {
          if (del) {
			let flags = actor.getFlag("FoundryVTT-starfinder-houserules-raavi", "modList");
			flags.splice(moduleId, 1);
			await actor.unsetFlag("FoundryVTT-starfinder-houserules-raavi", "modList");
			await actor.setFlag("FoundryVTT-starfinder-houserules-raavi", "modList", flags);
          }
		  fixActiveTab(app);
        },
      }).render(true);
    });

    tabs.find('.item[data-tab="modules"]').click((ev) => {
      app.activateModulesTab = true;
    });

    tabs.find('.item:not(.tabs .item[data-tab="modules"])').click((ev) => {
        app.activateModulesTab = false;
    });
  }
}

async function generateModuleOnClick(event, html, app, actor, slot) {
	event.preventDefault();

	let add = false;
	let dialogContent = await renderTemplate("modules/FoundryVTT-starfinder-houserules-raavi/templates/add-module-dialog.html");

	// Create dialog
	new Dialog({
		title: `Add Module`,
		content: dialogContent,
		buttons: {
		  yes: {
			icon: "<i class='fas fa-check'></i>",
			label:"Create",
			callback: () => (add = true),
		  },
		  no: {
			icon: "<i class='fas fa-times'></i>",
			label: "Cancel",
			callback: () => (add = false),
		  }
		},
		default: "yes",
		close: async (html) => {
		  if (add) {
			addModule(actor, html, slot);
		  }
		  fixActiveTab(app);
		},
	}).render(true);
}

async function addModule(actor, html, modSlot) {
	let modName = html.find('[name=module-name]')[0].value;
	let modDesc = html.find('[name=module-desc]')[0].value;
	let modPCU = html.find('[name=module-pcu]')[0].value;

	if (modPCU === undefined || modPCU === null || modPCU === "" || isNaN(modPCU) || parseInt(modPCU) < 0) {
		modPCU = 0;
	}

	let module = { name: modName, description: modDesc, pcu: parseInt(modPCU), slot: modSlot };

	let flags = actor.getFlag("FoundryVTT-starfinder-houserules-raavi", "modList");
    flags.push(module);
    await actor.unsetFlag("FoundryVTT-starfinder-houserules-raavi", "modList");
    await actor.setFlag("FoundryVTT-starfinder-houserules-raavi", "modList", flags);
}

async function compileModulesTab(modulesTabHtml, sheet) {
  return new Promise((resolve, reject) => {
	sheet.append(modulesTabHtml)
	resolve(sheet);
  });
}

function fixActiveTab(app) {
	app.activateModulesTab = true;
}