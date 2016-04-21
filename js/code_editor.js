// js.initHighlightingOnLoad();
var project = {}
var projectName = ""
var cause = "input";
var httpRequest;
var editors = {}
var count = 1;
function setCookie(fileType, className) {
	var cookie = decodeURIComponent(document.cookie);
	var i = cookie.search(fileType+"=");
	console.log(i, fileType, className, cookie)
	if(i >= 0){
		cookie = cookie.replace(fileType+"[]=", fileType+"[]="+projectName+"/"+className+"&")
	}else
		cookie+= "&"+fileType+"[]="+projectName+"/"+className;
	console.log(cookie)
	document.cookie = cookie
}
function updateContent(event) {
	project[code.getAttribute("type")][code.getAttribute("j")][code.className] = code.value;	
	code.innerHTML = code.value;
	editors[code.className] = code;
	output.contentWindow.clientHeight = output.clientHeight;
	output.contentWindow.clientWidth = output.clientWidth;
	output.setAttribute("srcdoc", editors[projectName+"/"+"index.html"].value);

}
function createButtonAndItsEditor(fileType,j) {
	className = (Object.keys(project[fileType][j])[0]);
	var editor = document.createElement('textarea');
	editor.id = "code";
	editor.setAttribute("type", fileType);
	editor.setAttribute("j", j);
	editor.className = className;
	editor.value = project[fileType][j][className];
	editor.addEventListener("input", updateContent);
	editor.addEventListener("keydown", function (event) {
		if (event.ctrlKey){
			if(event.which == 'M'.charCodeAt(0))
				saveFile()
		}
		
	});			
	editor.innerHTML = project[fileType][j][className];
	editors[className] = editor;
	var button = document.createElement('button');
	button.innerHTML = className.replace(projectName+"/", "");
	button.id = className;
	button.className = "btn btn-info editorButtons";
	button.className = "btn btn-info btn-sm editorButtons";	
	button.addEventListener("click",function(event) {
		code.remove();
		codeArea.insertBefore(editors[event.target.id], codeArea.firstChild);
		output.contentWindow.clientHeight = output.clientHeight;
		output.contentWindow.clientWidth = output.clientWidth;
		output.setAttribute("srcdoc", editors[projectName+"/"+"index.html"].value);
	});
	if(!document.getElementById(className))
		buttonArea.insertBefore(button, newFileBox);
		// codeArea.appendChild(button);	
}

function buildCodeArea() {
	var button = document.createElement('button');
	var fileBox = document.createElement('input');
	//fileBox.hidden = true;
	fileBox.id = "newFileBox";
	fileBox.className = "newFileBox";
	fileBox.size = 4;
	button.id = "newFile";
	button.className = "btn btn-warning newButtons";

	button.textContent = "+"

	if (!document.getElementById(button.id)) {
		buttonArea.appendChild(button);
		buttonArea.insertBefore(fileBox, button);
	}

	for(var i in project){
		for(var j in project[i]){
			console.log(i, j)
			createButtonAndItsEditor(i, j)
		}
	}
	if (count % 2 != 0) {
		fileBox.hidden = true;
		
		$(document).ready(function () {
			$('#newFile').hover(function () {
				fileBox.hidden = false;
			});
			$('#newFile').click(function () {
				var className = $('.newFileBox').val();
				
				if (className.length != 0) {
					var tmp = /\.[a-z]+$/i;
					
					var fileType = tmp.exec(className)[0].split(".")[1];
					console.log(className,fileType);
					console.log("Add UI to insert name and destination directory ")
					console.log(project[fileType]);
					project[fileType].push({[projectName+"/"+className]:""});
					console.log(project)
					console.log(editors)
					setCookie(fileType, className)
					createButtonAndItsEditor(fileType, project[fileType].length - 1);					
								
				}
			});

		});
	}
	console.log(button.id);
	count++;
	console.log(editors)
	if(window["code"])	
		code.remove();
	codeArea.insertBefore(editors[projectName+"/"+"index.html"], codeArea.firstChild);	
	output.contentWindow.clientHeight = output.clientHeight;
	output.contentWindow.clientWidth = output.clientWidth;
	output.setAttribute("srcdoc", editors[projectName+"/"+"index.html"].value);
}
function addClassCodeEditor() {
	var i = 0
	var stack = [output.contentWindow.document]
	while (stack.length > 0) {
		var element = stack.pop();
		var elementChildren = element.children;
		for (var e = 0; e < elementChildren.length; e++) {
			elementChildren[e].className = ((elementChildren[e].className)?(elementChildren[e].className+" "):"") +"codeEditor";
			// elementChildren[e].className += "codeEditor"+i;
			stack.push(elementChildren[e]);
		}
	}

}
function replaceScriptAndCssTags() {
	console.log(editors)
	var scripts = output.contentWindow.document.getElementsByTagName('script');
	// console.log(scripts)
	for(var script = 0; script < scripts.length; script++){
		if(scripts[script].src != ""){
			var foundReplacement = false;
			s = output.contentWindow.document.createElement('script');
			s.type = "text/javascript";
			console.log(editors, scripts[script].src)
			for(var i in editors){

				if(scripts[script].src.search(i.replace(projectName+"/", ""))!= -1){
					console.log(editors[i].innerText)
					s.text = editors[i].innerText;
					foundReplacement = true;
				}
			}
			if(foundReplacement){
				scripts[script].parentNode.replaceChild(s, scripts[script])
				script--;
			}
		}
	}
	var csss = output.contentWindow.document.getElementsByTagName('link');
	// console.log(output.contentWindow.document)
	// console.log(csss, csss.length)
	for(var css = 0; css < csss.length; css++){
		// console.log(css, csss[css].href, csss.length)
		if(csss[css].href != ""){
			s = output.contentWindow.document.createElement('style');
			var foundReplacement = false;
			for(var i in editors){
				console.log("inside", csss[css].href, i)
				if(csss[css].href.search(i.replace(projectName+"/", ""))!= -1){
					s.innerHTML =  editors[i].value;
					foundReplacement = true;
					break;
				}
			}			

			if(foundReplacement){
				csss[css].parentNode.replaceChild(s, csss[css])
				css--;
			}
		}
		// console.log(css, csss[css].href, csss.length)
	}
}

function displayDOM(element, dom_window){
	dom_window.document.body.appendChild(element.cloneNode(true))
	for(var i = 0; i < element.children.length; i++){
		displayDOM(element.children[i], dom_window)
	}
	
}
function getSourceCode(event) {
	if (event.ctrlKey){
		element = event.target
		dom_window = window.open('', '_blank', 'height=200,width=200,modal=yes,alwaysRaised=yes')
		displayDOM(element, dom_window)
		event.stopPropagation();
	}
}
function saveFile() {
	httpRequest = new XMLHttpRequest();
	console.log(project)
	urlParametes = "code="+encodeURIComponent(JSON.stringify(project));

	// urlParametes = urlParametes.replace("'", "\'")	
	// console.log(urlParametes)
	if(document.cookie.search(projectName) >= 0){
	     httpRequest.open("get", "http://localhost/wtproject-master/codeEditor?"+urlParametes, true);
	     httpRequest.onreadystatechange = function() {
	     	console.log(httpRequest.responseText)
	     	// body...
	     }
	     httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	     httpRequest.send();
	}	
}
function getResponseCode(event) {
	if(httpRequest.readyState = XMLHttpRequest.DONE)
		if(httpRequest.status == 200){
			var response = httpRequest.responseText
			console.log(response);
			// console.log(response.slice(5, response.length-6))
			project = JSON.parse(response.slice(5, response.length-6))
			console.log(project)
			buildCodeArea();

		}
}

code.addEventListener("input", updateContent);
code.addEventListener("keydown", function (event) {
	if (event.ctrlKey){
		// console.log("Fine", event.which, 'm'.charCodeAt(0))
		if(event.which == 'M'.charCodeAt(0))
			saveFile()
	}
	
});
output.addEventListener("load", function (event) {
	addClassCodeEditor();
	var allELements = output.contentWindow.document.getElementsByClassName("codeEditor");
	for (var e = 0; e < allELements.length; e++) {
		allELements[e].removeEventListener("click", getSourceCode)
		allELements[e].addEventListener("click", getSourceCode, true)
	}
	output.contentWindow.document.body.style.zoom = output.contentWindow.innerWidth / window.document.body.clientWidth;	
	replaceScriptAndCssTags();
})
go.addEventListener("click", function checkValidityOfPath(event) {
	httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = getResponseCode;
	projectName = server_location.value;
    httpRequest.open("get", "http://localhost/wtproject-master/codeEditor?project="+server_location.value, true);
    // console.log(server_location.value);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send();		
})
$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});