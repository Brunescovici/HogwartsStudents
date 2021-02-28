let student = [],
  halfBloods = [],
  pureBloods = [],
  hufflepuffPrefects = [],
  ravenclawPrefects = [],
  slytherinPrefects = [],
  gryffindorPrefects = [],
  inqMembers = [],
  index = 0,
  index2 = 0,
  injected = 0;
let interval = setInterval(updateTime, 1000),
  timeLeft = 0;
  let nrStuds = 0;

fetch("https://petlatkea.dk/2021/hogwarts/families.json")
  .then((response) => response.json())
  .then((data) => setBloods(data));

fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then((data) => setStudents(data));

function setStudents(data) {
  data.forEach((st) => {
    let name = st.fullname.split(/[ -]+/),
      firstnames = [],
      nick,
      firstname,
      lastname,
      bloodtype = 0,
      bt;
    for (let i = 0; i < name.length; i++) {
      if (name[i] != "") {
        name[i] = capFirstLetter(name[i]);
        firstnames.push(name[i]);
      }
    }
    if (
      firstnames.length > 2 &&
      firstnames[firstnames.length - 2].search('"') >= 0
    ) {
      nick = firstnames[firstnames.length - 2].replace('"', "");
      nick = nick.replace('"', "");
      nick = capFirstLetter(nick);
      firstnames.splice(firstnames.length - 2, 1);
    }
    firstname = firstnames[0];
    for (let i = 1; i < firstnames.length - 1; i++)
      firstname = firstname + " " + firstnames[i];
    let house = st.house.split(" ");
    let i = 0;
    while (house[i] == "") i++;
    house[i] = capFirstLetter(house[i]);
    if (firstnames.length > 1) lastname = firstnames[firstnames.length - 1];
    else lastname = "";
    for (let j = 0; j < halfBloods.length; j++)
      if (halfBloods[j] == lastname) bloodtype = 1; //it is half blood
    for (let j = 0; j < pureBloods.length; j++)
      if (pureBloods[j] == lastname) {
        if (bloodtype == 0) bloodtype = 2;
        //it is pure blood
        else bloodtype = 3; //it is half-pure blood
      }
    if (bloodtype == 1) bt = "Half Blood";
    else if (bloodtype == 2) bt = "Pure Blood";
    else bt = "Half-pure Blood";
    if (nick)
      student.push({
        firstname: firstname,
        lastname: lastname,
        nickname: nick,
        gender: st.gender,
        house: house[i],
        bloodtype: bt,
        picture: lastname.toLowerCase() + "_" + firstname[0].toLowerCase(),
        prefect: 0,
        expelled: 0,
        inq: 0,
      });
    else
      student.push({
        firstname: firstname,
        lastname: lastname,
        gender: st.gender,
        house: house[i],
        bloodtype: bt,
        picture: lastname.toLowerCase() + "_" + firstname[0].toLowerCase(),
        prefect: 0,
        expelled: 0,
        inq: 0,
      });
  });
  showStudents();
}

function setBloods(data) {
  data.half.forEach((blood) => {
    halfBloods.push(blood);
  });
  data.pure.forEach((blood) => {
    pureBloods.push(blood);
  });
}

function capFirstLetter(s) {
  s = s[0].toUpperCase() + s.slice(1).toLowerCase();
  return s;
}

function showStudents() {
    nrStuds = 0;
  if (document.querySelector("#sort").value == "firstNameAZ")
    student.sort(compare);
  else if (document.querySelector("#sort").value == "firstNameZA")
    student.sort(compareR);
  else if (document.querySelector("#sort").value == "lastNameAZ")
    student.sort(compareLN);
  else if (document.querySelector("#sort").value == "lastNameZA")
    student.sort(compareLNR);
  else if (document.querySelector("#sort").value == "houseAZ")
    student.sort(compareH);
  else if (document.querySelector("#sort").value == "houseZA")
    student.sort(compareHR);
  for (let i = 0; i < student.length; i++) {
    const myTemplate = document.querySelector("#studentTemplate").content;
    const studentClone = myTemplate.cloneNode(true);
    if (student[i].lastname == "Patil")
      studentClone.querySelector(".studentPicture").src =
        "images/" + student[i].picture + student[i].firstname.slice(1) + ".png";
    else
      studentClone.querySelector(".studentPicture").src =
        "images/" + student[i].picture + ".png";
    if (student[i].nickname)
      studentClone.querySelector(".name").textContent =
        student[i].firstname +
        " " +
        student[i].nickname +
        " " +
        student[i].lastname;
    else
      studentClone.querySelector(".name").textContent =
        student[i].firstname + " " + student[i].lastname;
    const parent = document.querySelector("#stud_cont");
    parent.appendChild(studentClone);
    if (
      !(
        student[i].firstname +
        student[i].lastname +
        student[i].nickname
      ).includes(document.querySelector("#search").value)
    ) {
      parent.lastElementChild.classList.add("expelledAnim");
      parent.lastElementChild.style.display = "none";
    } else if (
      document.querySelector("#showPrefects").checked == true &&
      student[i].prefect == 0
    ) {
      parent.lastElementChild.classList.add("expelledAnim");
      parent.lastElementChild.style.display = "none";
    } else if (
      (student[i].expelled == 1 &&
        document.querySelector("#showExpelled").checked == false) ||
      (student[i].expelled == 0 &&
        document.querySelector("#showExpelled").checked == true)
    ) {
      parent.lastElementChild.classList.add("expelledAnim");
      parent.lastElementChild.style.display = "none";
    } else if (
      document.querySelector("#showSlytherin").checked == true &&
      student[i].house == "Slytherin"
    ) {
      parent.lastElementChild.style.display = "flex";
      nrStuds++;
    } else if (
      document.querySelector("#showRavenclaw").checked == true &&
      student[i].house == "Ravenclaw"
    ) {
      parent.lastElementChild.style.display = "flex";
      nrStuds++;
    } else if (
      document.querySelector("#showGryffindor").checked == true &&
      student[i].house == "Gryffindor"
    ) {
      parent.lastElementChild.style.display = "flex";
      nrStuds++;
    } else if (
      document.querySelector("#showHufflepuff").checked == true &&
      student[i].house == "Hufflepuff"
    ) {
      parent.lastElementChild.style.display = "flex";
      nrStuds++;
    } else if (
      document.querySelector("#showHufflepuff").checked == false &&
      document.querySelector("#showGryffindor").checked == false &&
      document.querySelector("#showRavenclaw").checked == false &&
      document.querySelector("#showSlytherin").checked == false &&
      document.querySelector("#showPrefects").checked == false
    ) {
      parent.lastElementChild.style.display = "flex";
      nrStuds++;
    } else if (
      document.querySelector("#showHufflepuff").checked == true ||
      document.querySelector("#showRavenclaw").checked == true ||
      document.querySelector("#showGryffindor").checked == true ||
      document.querySelector("#showSlytherin").checked == true
    ) {
      parent.lastElementChild.classList.add("expelledAnim");
      parent.lastElementChild.style.display = "none";
    }
  }
  console.log("if you are reading this, thank you for checking the console :)");
  document.querySelectorAll(".studentPicture").forEach((sp) => {
    sp.addEventListener("click", function () {
      openOverlay(sp.parentNode.querySelector(".name").textContent);
    });
  });
  document.querySelectorAll(".student .name").forEach((sn) => {
    sn.addEventListener("click", function () {
      openOverlay(sn.textContent);
    });
  });
  document.querySelector("#showingStudents").textContent = "Showing: " + nrStuds + " out of " + student.length + " students.";
}

function openOverlay(studentName) {
  let found = 0;
  index = 0;
  while (found == 0 && index < student.length) {
    if (
      student[index].nickname != "" &&
      student[index].firstname +
        " " +
        student[index].nickname +
        " " +
        student[index].lastname ==
        studentName
    ) {
      found = 1;
    } else if (
      student[index].firstname + " " + student[index].lastname ==
      studentName
    )
      found = 1;
    else index++;
  }
  document.querySelector("#overlay .name").innerHTML =
    "First name: " +
    student[index].firstname +
    "<br>Last name: " +
    student[index].lastname;
  document.querySelector("#overlay .studentPicture").src =
    "images/" + student[index].picture + ".png";
  document.querySelector("#nickname").textContent = student[index].nickname;
  document.querySelector("#gender").textContent =
    "Gender: " + student[index].gender;
  document.querySelector("#bloodType").textContent =
    "Blood type: " + student[index].bloodtype;
  document.querySelector("#houseName").textContent =
    "House: " + student[index].house;
  if (student[index].prefect == 1) {
    document.querySelector("#makePrefect").disabled = true;
    document.querySelector("#makePrefect").textContent = "Already Prefect";
  } else {
    document.querySelector("#makePrefect").disabled = false;
    document.querySelector("#makePrefect").textContent = "Make Prefect";
  }
  if (student[index].inq == 1) {
    document.querySelector("#makeMember").disabled = true;
    document.querySelector("#makeMember").textContent = "Already Member";
  } else {
    document.querySelector("#makeMember").disabled = false;
    document.querySelector("#makeMember").textContent = "Make Member";
  }
  if (injected) document.querySelector("#makeMember").style.display = "block";
  if(student[index].expelled)
  document.querySelector("#expellBtn").disabled = true;
  document.querySelector("#grayBG").style.display = "flex";
}

document.querySelector("#closeBtn").addEventListener("click", closeOverlay);

function closeOverlay() {
  document.querySelector("#grayBG").style.display = "none";
}

document.querySelector("#makePrefect").addEventListener("click", makePrefect);

function makePrefect() {
  if (student[index].prefect == 0) {
    if (student[index].house == "Hufflepuff" && hufflepuffPrefects.length < 2) {
      student[index].prefect = 1;
      hufflepuffPrefects.push(student[index]);
      document.querySelector("#makePrefect").disabled = true;
      document.querySelector("#makePrefect").textContent = "Already Prefect";
    } else if (
      student[index].house == "Ravenclaw" &&
      ravenclawPrefects.length < 2
    ) {
      student[index].prefect = 1;
      ravenclawPrefects.push(student[index]);
      document.querySelector("#makePrefect").disabled = true;
      document.querySelector("#makePrefect").textContent = "Already Prefect";
    } else if (
      student[index].house == "Gryffindor" &&
      gryffindorPrefects.length < 2
    ) {
      student[index].prefect = 1;
      gryffindorPrefects.push(student[index]);
      document.querySelector("#makePrefect").disabled = true;
      document.querySelector("#makePrefect").textContent = "Already Prefect";
    } else if (
      student[index].house == "Slytherin" &&
      slytherinPrefects.length < 2
    ) {
      student[index].prefect = 1;
      slytherinPrefects.push(student[index]);
      document.querySelector("#makePrefect").disabled = true;
      document.querySelector("#makePrefect").textContent = "Already Prefect";
    } else
      document.querySelector("#makePrefect").textContent =
        "Too many prefects at this house!";
  }
}

document.querySelector("#expellBtn").addEventListener("click", expellStudent);

function expellStudent() {
  closeOverlay();
  if (student[index].lastname == "Pricope") {
    setTimeout(changeBackgroundColor, 500);
    changePictures();
  } else {
    document.querySelectorAll(".student").forEach((stud) => {
      if (student[index].nickname) {
        if (
          stud.querySelector(".name").textContent ==
          student[index].firstname +
            " " +
            student[index].nickname +
            " " +
            student[index].lastname
        ) {
          stud.classList.add("expelledAnim");
          setTimeout(function () {
            stud.style.display = "none";
          }, 1000);
          student[index].expelled = 1;
        }
      } else if (
        stud.querySelector(".name").textContent ==
        student[index].firstname + " " + student[index].lastname
      ) {
        stud.classList.add("expelledAnim");
        setTimeout(function () {
          stud.style.display = "none";
        }, 1000);
        student[index].expelled = 1;
      }
    });
  }
  nrStuds--;
  document.querySelector("#showingStudents").textContent = "Showing: " + nrStuds + " out of " + student.length + " students.";
}

document.querySelector("#sort").addEventListener("change", resetStudents);

function resetStudents() {
  while (document.querySelector("#stud_cont").lastElementChild)
    document
      .querySelector("#stud_cont")
      .removeChild(document.querySelector("#stud_cont").lastElementChild);
  showStudents();
}

function compare(a, b) {
  if (a.firstname > b.firstname) return 1;
  if (a.firstname < b.firstname) return -1;
  return 0;
}

function compareR(a, b) {
  if (a.firstname > b.firstname) return -1;
  if (a.firstname < b.firstname) return 1;
  return 0;
}

function compareLN(a, b) {
  if (a.lastname > b.lastname) return 1;
  if (a.lastname < b.lastname) return -1;
  return 0;
}

function compareLNR(a, b) {
  if (a.lastname > b.lastname) return -1;
  if (a.lastname < b.lastname) return 1;
  return 0;
}

function compareH(a, b) {
  if (a.house > b.house) return 1;
  if (a.house < b.house) return -1;
  return 0;
}

function compareHR(a, b) {
  if (a.house > b.house) return -1;
  if (a.house < b.house) return 1;
  return 0;
}

document.querySelectorAll(".cb").forEach((cb) => {
  cb.addEventListener("change", resetStudents);
});

document.querySelector("#search").addEventListener("change", resetStudents);

document.querySelector("#inject").addEventListener("click", hackTheSystem);

function hackTheSystem() {
  injected = 1;
  document.querySelector("#makeMember").style.display = "block";
  student.push({
    firstname: "Cristian Andrei",
    lastname: "Pricope",
    nickname: "Brun",
    gender: "boy",
    house: "Gryffindor",
    bloodtype: "Pure",
    picture: "self",
    prefect: 0,
    expelled: 0,
    inq: 0,
  });
  changeBlood();
  resetStudents();
  document.querySelector("#inject").disabled = true;
  document.querySelector("#inject").textContent = "60";
  timeLeft = 60;
  setTimeout(resetInjection, 60000);
}

function resetInjection() {
  document.querySelector("#inject").disabled = false;
  document.querySelector("#inject").textContent = "Inject!";
  document.querySelector("#makeMember").style.display = "none";
  let i = 0;
  while (student[i].lastname != "Pricope") i++;
  student.splice(i, 1);
  injected = 0;
  while(inqMembers.length>0)
  inqMembers.splice(inqMembers.length-1, 1);
  for(let i = 0 ; i<student.length; i++) {
      student[i].inq = 0;
  }
  resetStudents();
}

function updateTime() {
  if (injected) {
    timeLeft--;
    document.querySelector("#inject").textContent = timeLeft;
  }
}

function changeBackgroundColor() {
  if (document.querySelector("body").style.backgroundColor == "red")
    document.querySelector("body").style.backgroundColor = "white";
  else document.querySelector("body").style.backgroundColor = "red";
  if (index2 < 21 && injected) {
    setTimeout(changeBackgroundColor, 500);
    index2++;
  } else {
    index2 = 0;
    resetStudents();
    document.querySelector("body").style.backgroundColor = "white";
  }
}

function changePictures() {
  let r = Math.floor(Math.random() * 33),
    aux,
    r2 = Math.floor(Math.random() * 33);
  aux = document
    .querySelector(".student:nth-child(" + r + ")")
    .querySelector(".studentPicture").src;
  document
    .querySelector(".student:nth-child(" + r + ")")
    .querySelector(".studentPicture").src = document
    .querySelector(".student:nth-child(" + r2 + ")")
    .querySelector(".studentPicture").src;
  document
    .querySelector(".student:nth-child(" + r2 + ")")
    .querySelector(".studentPicture").src = aux;

  if (index2 < 21 && injected) setTimeout(changePictures, 500);
}

function changeBlood() {
    for(let i=0; i<student.length; i++)
    {
        if(student[i].bloodtype == "Pure Blood")
            {
                let r = Math.floor(Math.random() * 3)
                if(r == 0)
                student[i].bloodtype = "Pure Blood";
                else if( r== 1)
                student[i].bloodtype = "Half-Blood";
                else
                student[i].bloodtype = "Half-pure Blood";
            }
        else
            student[i].bloodtype = "Pure Blood";
    }
}

document.querySelector("#makeMember").addEventListener("click", makeMember);

function makeMember() {
  if (student[index].expelled == 0)
    document.querySelector("#makeMember").textContent =
      "Student not expelled yet";
  else {
    inqMembers.push(student[index]);
    document.querySelector("#makeMember").textContent = "Already member";
    document.querySelector("#makeMember").disabled = true;
  }
}
