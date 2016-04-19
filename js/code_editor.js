// js.initHighlightingOnLoad();
var project = {}
var projectName = ""
var fileName = "/home/abhijtih/TEMP/"
var httpRequest;
var editors = {}
function updateContent() {
	output.contentWindow.clientHeight = output.clientHeight;
	output.contentWindow.clientWidth = output.clientWidth;
	output.setAttribute("srcdoc", editors[projectName+"/index.html"].value);

}
function buildCodeArea() {
	for(var i in project){
		for(var j in project[i]){
			console.log(i, j)
			var editor = document.createElement('textarea');
			editor.id = "code";
			editor.value = project[i][j];
			editors[j] = editor;
			editors[j].innerHtml = project[i][j];;
			editors[j].setAttribute("fileType", i);
			var button = document.createElement('button');
			button.innerHTML = j.toString().split(projectName+"/")[1];
			button.id = j;
			button.className = "editorButtons";
			button.addEventListener("click",function(event) {
				code.remove();
				codeArea.insertBefore(editors[event.target.id], codeArea.firstChild);
				updateContent();
				// console.log(editors[event.target.id])
			});
			codeArea.appendChild(button);
		}
	}
	code.remove();
	codeArea.insertBefore(editors[projectName+"/index.html"], codeArea.firstChild);	
	updateContent();
}
function addClassCodeEditor() {
	var i = 0
	var stack = [output.contentWindow.document]
	while (stack.length > 0) {
		var element = stack.pop();
		var elementChildren = element.children;
		for (var e = 0; e < elementChildren.length; e++) {
			elementChildren[e].className += "codeEditor";
			// elementChildren[e].className += "codeEditor"+i;
			stack.push(elementChildren[e]);
		}
	}
}

function displayDOM(element, dom_window){
	dom_window.document.body.appendChild(element)
	for(var i = 0; i < element.children.length; i++){
		displayDOM(element.children[i], dom_window)
	}
	
}
function getSourceCode(event) {
	if (event.ctrlKey){
		element = event.currentTarget
		dom_window = window.open('', '_blank', 'height=200,width=200,modal=yes,alwaysRaised=yes')
		displayDOM(element, dom_window)
		event.stopPropagation();
	}
}
function saveFile(fileName) {
	httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = getResponseCode;
	urlParametes = "code="+code.value;
	if(document.cookie.search("path") >= 0){
	    httpRequest.open("get", "./codeEditor?"+urlParametes, true);
	    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	    httpRequest.send();
	}	
}
function getResponseCode(event) {
	if(httpRequest.readyState = XMLHttpRequest.DONE)
		if(httpRequest.status == 200){
			var response = httpRequest.responseText
			console.log(response.slice(5, response.length-6))
			project = JSON.parse(response.slice(5, response.length-6))
			buildCodeArea();
		}
}

code.addEventListener("input", updateContent);
code.addEventListener("keydown", function (event) {
	if (event.ctrlKey){
		console.log("Fine", event.which, 'm'.charCodeAt(0))
		if(event.which == 'M'.charCodeAt(0))
			saveFile(fileName)
	}
	
});
output.addEventListener("load", function (event) {
	addClassCodeEditor();
	var allELements = output.contentWindow.document.getElementsByClassName("codeEditor");
	output.contentWindow.document.children[0].children[1].setAttribute("contentEditable","true");
	console.log("what")
	for (var e = 0; e < allELements.length; e++) {
		allELements[e].removeEventListener("click", getSourceCode)
		allELements[e].addEventListener("click", getSourceCode, true)
	}
	output.contentWindow.document.body.style.zoom = output.contentWindow.innerWidth / window.document.body.clientWidth;
})
go.addEventListener("click", function checkValidityOfPath(event) {
	httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = getResponseCode;
	projectName = server_location.value;
    httpRequest.open("get", "./codeEditor?project="+server_location.value, true);
    console.log(server_location.value);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send();		
})