// const API_ENDPOINT = "https://search-api-stg.byjusweb.com/byjus/web_search/";
// const API_ENDPOINT = "http://localhost:8080/byjus/web_search/";
const API_ENDPOINT = 'https://search-api.byjusweb.com/byjus/web_search/';
const loginProfiles = [
  {
    role: "Editor",
    uname: "external.question.creator@byjus.com",
    pass: "byjus@123",
  },
];
var editors = {};
var quesId = null;

function destroyEditor(){
  if(editors['questionEditor']){
    editors['questionEditor'].destroy();
    editors['solutionEditor'].destroy();
  }
}

function initiateCKEditor() {
  document.getElementById('ckeditorSection').style.display = 'block';

  ClassicEditor.create(document.querySelector("#questionEditor"), {
    licenseKey: "5ZcjIrIfjhdpspZ",
    wproofreader: {
      serviceId: "5ZcjIrIfjhdpspZ",
      srcUrl:
        "https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js",
    },
  })
  
  
    .then((editor) => {
      window.editor = editor;
      editors['questionEditor'] = editor;
    })
    .catch((error) => {
      console.error("Oops, something went wrong!");
      console.error(error);
    });

  ClassicEditor.create(document.querySelector("#solutionEditor"), {
    licenseKey: "5ZcjIrIfjhdpspZ",
    wproofreader: {
      serviceId: "5ZcjIrIfjhdpspZ",
      srcUrl:
        "https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js",
    },
  })
    .then((editor) => {
      window.editor = editor;
      editors['solutionEditor'] = editor;
    })
    .catch((error) => {
      console.error("Oops, something went wrong!");
      console.error(error);
    });
}

function logout() {
  localStorage.removeItem("uname");
  localStorage.removeItem("psswrd");
  localStorage.removeItem("role");
  window.location.reload();
}

function checkLogin() {
  if (localStorage.getItem("uname") && localStorage.getItem("psswrd")) {
    loginUser(localStorage.getItem("uname"), localStorage.getItem("psswrd"));
  }
}

function loginUser(username, password) {
  document.getElementById("messageScreen").innerHTML = "";

  for (profile in loginProfiles) {
    if (
      username == loginProfiles[profile]["uname"] &&
      password == loginProfiles[profile]["pass"]
    ) {
      localStorage.setItem("uname", username);
      localStorage.setItem("psswrd", password);
      localStorage.setItem("role", loginProfiles[profile]["role"]);
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("editorSection").style.display = "block";
      document.getElementById("roleDiv").innerHTML =
        "Role : " + loginProfiles[profile]["role"];
      return;
    }
  }

  document.getElementById("messageScreen").style.color = "red";
  document.getElementById("messageScreen").innerHTML = "Invalid credentials!";
}

function fetchData() {
  document.getElementById("messageScreenFetch").innerHTML = "Loading...";
  document.getElementById('ckeditorSection').style.display = 'none';
  destroyEditor();

  quesId = document.getElementById("questionId").value;
  if (quesId) {
    let fetchRes = fetch(API_ENDPOINT + "get_question_by_id/" + quesId + "/");
    fetchRes
      .then((res) => res.json())
      .then((d) => {
        if(d.isError == undefined){
          var solutionText = d["question_Solution_Mathjax"]
            ? d["question_Solution_Mathjax"]
            : d["question_Solution"];
          var questionText = d["question_Title_Mathjax"]
            ? d["question_Title_Mathjax"]
            : d["question_Title"];

          document.getElementById("questionEditor").innerHTML = questionText;
          document.getElementById("solutionEditor").innerHTML = solutionText;

          initiateCKEditor();

          document.getElementById("messageScreenFetch").innerHTML = "";
        }
        else{
          throw('Error')
        }
      })
      .catch((error) => {
        console.log(error)
        document.getElementById("messageScreenFetch").style.color = "red";
        document.getElementById("messageScreenFetch").innerHTML =
          "Could not load data!";
      });
  } else {
    document.getElementById("messageScreenFetch").style.color = "red";
    document.getElementById("messageScreenFetch").innerHTML = "Could not load data!";
  }
}

function updateQuestion(){
  var question = editors['questionEditor'].getData();
  var solution = editors['solutionEditor'].getData()

  let fetchRes = fetch(API_ENDPOINT + "update_question/", {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  
    body: JSON.stringify({
      'qid' : quesId,
      'question' : question,
      'solution' : solution
    })
  });
  fetchRes
    .then((res) => res.json())
    .then((d) => {
      document.getElementById("messageScreenSubmit").style.color = "green";
      document.getElementById("messageScreenSubmit").innerHTML = "Updated details!";
    }).catch((error) => {
      document.getElementById("messageScreenSubmit").style.color = "red";
      document.getElementById("messageScreenSubmit").innerHTML = "Could not update details!";
    })
}
