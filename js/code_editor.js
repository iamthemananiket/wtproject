// js.initHighlightingOnLoad();
var project = {}
var projectName = ""
var cause = "input";
var httpRequest;
var editors = {}
function updateContent(event) {
	project[code.getAttribute("type")][projectName + "/" + code.className] = code.value;
	code.innerHTML = code.value;
	editors[code.className] = code;
	output.contentWindow.clientHeight = output.clientHeight;
	output.contentWindow.clientWidth = output.clientWidth;
	output.setAttribute("srcdoc", editors["index.html"].value);

}
function createButtonAndItsEditor(fileType, className) {
	var editor = document.createElement('textarea');
	editor.id = "code";
	editor.setAttribute("type", fileType);
	editor.className = className;
	editor.value = project[fileType][projectName + "/" + className];
	editor.addEventListener("input", updateContent);
	editor.addEventListener("keydown", function (event) {
		if (event.ctrlKey) {
			if (event.which == 'M'.charCodeAt(0))
				saveFile()
		}

	});
	editor.innerHTML = project[fileType][projectName + "/" + className];
	editors[className] = editor;
	var button = document.createElement('button');
	button.innerHTML = className.toString();
	button.id = className;
	button.className = "btn btn-info editorButtons";
	
	button.addEventListener("click", function (event) {
		code.remove();
		codeArea.insertBefore(editors[event.target.id], codeArea.firstChild);
		output.contentWindow.clientHeight = output.clientHeight;
		output.contentWindow.clientWidth = output.clientWidth;
		output.setAttribute("srcdoc", editors["index.html"].value);
	});
	if (!document.getElementById(className))
		buttonArea.appendChild(button);
}

function buildbuttonArea() {
	// console.log(project)
	for (var i in project) {
		for (var j in project[i]) {
			j = j.replace(projectName + "/", "");
			createButtonAndItsEditor(i, j)
			console.log(i, j);
		}
	}
	var button = document.createElement('button');
	var fileBox = document.createElement('input');
	//fileBox.hidden = true;
	fileBox.className = "newFileBox";
	fileBox.size = 4;
	button.id = "newFile";
	button.className = "newButtons";
	button.textContent = "+"
	// button.addEventListener("click", function (event) {
	// 	// body...
	// 	console.log("Add UI to insert name and destination directory ")
	// 	//fileType directory name
	// 	//className name of the file
	// 	// createButtonAndItsEditor(fileType,className);
	// 	// project[fileType][className] = 
	// 	// console.log(project) 

	// 	});

	if (!document.getElementById(button.id)) {
		buttonArea.appendChild(button);
		buttonArea.insertBefore(fileBox, button);
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
					$("<button  id=" + className + " class = 'btn btn-info editorButtons'>" + className + "</button>").insertBefore('.newFileBox');
					var tmp = /\.[a-z]+$/i;
					
					var fileType = tmp.exec(className)[0].split(".")[1];
					console.log(className,fileType);
					
				}
			});

		});
	}
	console.log(button.id);
	count++;
	if (code)
		code.remove();
	codeArea.insertBefore(editors["index.html"], codeArea.firstChild);
	output.contentWindow.clientHeight = output.clientHeight;
	output.contentWindow.clientWidth = output.clientWidth;
	output.setAttribute("srcdoc", editors["index.html"].value);
}
function addClassCodeEditor() {
	var i = 0
	var stack = [output.contentWindow.document]
	while (stack.length > 0) {
		var element = stack.pop();
		var elementChildren = element.children;
		for (var e = 0; e < elementChildren.length; e++) {
			elementChildren[e].className = ((elementChildren[e].className) ? (elementChildren[e].className + " ") : "") + "codeEditor";
			// elementChildren[e].className += "codeEditor"+i;
			stack.push(elementChildren[e]);
		}
	}

}
function replaceScriptAndCssTags() {
	var scripts = output.contentWindow.document.getElementsByTagName('script');
	// console.log(scripts)
	for (var script = 0; script < scripts.length; script++) {
		if (scripts[script].src != "") {
			s = output.contentWindow.document.createElement('script');
			s.type = "text/javascript";
			// console.log(editors, scripts[script].src)
			for (var i in editors) {
				if (scripts[script].src.search(i) != -1) {
					s.text = editors[i].innerText;
					break;
				}
			}
			scripts[script].parentNode.replaceChild(s, scripts[script])
		}
	}
	var csss = output.contentWindow.document.getElementsByTagName('link');
	for (var css = 0; css < csss.length; css++) {
		if (csss[css].href != "") {
			s = output.contentWindow.document.createElement('style');
			// console.log(editors)
			for (var i in editors) {
				if (csss[css].href.search(i) != -1) {
					s.innerHTML = editors[i].value;
					// console.log(s, editors[i], i)
					break;
				}
			}


			csss[css].parentNode.replaceChild(s, csss[css])
		}
	}
}

function displayDOM(element, dom_window) {
	dom_window.document.body.appendChild(element)
	for (var i = 0; i < element.children.length; i++) {
		displayDOM(element.children[i], dom_window)
	}

}
function getSourceCode(event) {
	if (event.ctrlKey) {
		element = event.currentTarget
		dom_window = window.open('', '_blank', 'height=200,width=200,modal=yes,alwaysRaised=yes')
		displayDOM(element, dom_window)
		event.stopPropagation();
	}
}
function saveFile() {
	httpRequest = new XMLHttpRequest();
	urlParametes = "code=" + encodeURIComponent(JSON.stringify(project));

	// urlParametes = urlParametes.replace("'", "\'")	
	// console.log(urlParametes)
	if (document.cookie.search(projectName) >= 0) {
		httpRequest.open("get", "./wtproject-master/codeEditor?" + urlParametes, true);
		httpRequest.onreadystatechange = function () {
			console.log(httpRequest.responseText)
			// body...
		}
		httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpRequest.send();
	}
}
function getResponseCode(event) {
	if (httpRequest.readyState = XMLHttpRequest.DONE)
		if (httpRequest.status == 200) {
			var response = httpRequest.responseText
			console.log(httpRequest.responseText);
			project = JSON.parse(response.slice(5, response.length - 6))
			buildbuttonArea();

		}
}
var count = 1;
code.addEventListener("input", updateContent);
code.addEventListener("keydown", function (event) {
	if (event.ctrlKey) {
		// console.log("Fine", event.which, 'm'.charCodeAt(0))
		if (event.which == 'M'.charCodeAt(0))
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
    httpRequest.open("get", "./codeEditor?project=" + server_location.value, true);
    // console.log(server_location.value);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send();
})

$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});