let student = [],
  halfBloods = [],
  pureBloods = [],
  hufflepuffPrefects = [],
  ravenclawPrefects = [],
  slytherinPrefects = [],
  gryffindorPrefects = [],
  index = 0;

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
  }
  console.log("yes");
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
    } else if (student[index].firstname + " " + student[index].lastname == studentName)
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
  if(student[index].prefect == 1)
    {document.querySelector("#makePrefect").disabled = true;
    document.querySelector("#makePrefect").textContent = "Already Prefect";
}
    else {
        document.querySelector("#makePrefect").disabled = false;
    document.querySelector("#makePrefect").textContent = "Make Prefect";
    }
  document.querySelector("#grayBG").style.display = "flex";
}

document.querySelector("#closeBtn").addEventListener("click", closeOverlay);

function closeOverlay() {
  document.querySelector("#grayBG").style.display = "none";
}

document.querySelector("#makePrefect").addEventListener("click", makePrefect);

function makePrefect() {
    if(student[index].prefect == 0)
    {
    if(student[index].house == "Hufflepuff" && hufflepuffPrefects.length < 2)
        {
            student[index].prefect = 1;
            hufflepuffPrefects.push(student[index]);
            document.querySelector("#makePrefect").disabled = true;
            document.querySelector("#makePrefect").textContent = "Already Prefect";
        }
    else if(student[index].house == "Ravenclaw" && ravenclawPrefects.length < 2)
        {
            student[index].prefect = 1;
            ravenclawPrefects.push(student[index]);
            document.querySelector("#makePrefect").disabled = true;
            document.querySelector("#makePrefect").textContent = "Already Prefect";
        }
    else if(student[index].house == "Gryffindor" && gryffindorPrefects.length < 2)
        {
            student[index].prefect = 1;
            gryffindorPrefects.push(student[index]);
            document.querySelector("#makePrefect").disabled = true;
            document.querySelector("#makePrefect").textContent = "Already Prefect";
        }
    else if(student[index].house == "Slytherin" && slytherinPrefects.length < 2)
        {
            student[index].prefect = 1;
            slytherinPrefects.push(student[index]);
            document.querySelector("#makePrefect").disabled = true;
            document.querySelector("#makePrefect").textContent = "Already Prefect";
        }
    else
        document.querySelector("#makePrefect").textContent = "Too many prefects at this house!";
    }
}
