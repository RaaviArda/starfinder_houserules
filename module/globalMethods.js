function addTime(hours) {
	let host = window.location.origin;

    let url = host.concat("/starfinder/").concat("rscshrt");
	let resrqst = new XMLHttpRequest();
    resrqst.open('POST', url);
    resrqst.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    resrqst.onreadystatechange = function() { resResponse(this); };
    let postData = "action=addtime&time=".concat(hours);
    resrqst.send(postData);
}

function refreshResources() {
	let host = window.location.origin;

	let url = host.concat("/starfinder/").concat("rscshrt");
	let resrqst = new XMLHttpRequest();
    resrqst.open('GET', url);
    resrqst.onreadystatechange = function() { resResponse(this); };
    resrqst.send();
}

function resResponse(resrqst) {
    if (resrqst.readyState != 4) {
        return;
    }
    
    showResResp(resrqst.responseText);
}

function showResResp(resrsp) {
	let responseContainer = document.querySelector('#toptable');

    responseContainer.innerHTML = resrsp;
}