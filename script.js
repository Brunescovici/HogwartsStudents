let student = [], halfBloods = [], pureBloods = [];

fetch('https://petlatkea.dk/2021/hogwarts/families.json')
    .then(response => response.json())
    .then(data => setBloods(data));



fetch('https://petlatkea.dk/2021/hogwarts/students.json')
    .then(response => response.json())
    .then(data => setStudents(data));

function setStudents(data) {
    data.forEach(st => {
        let name = st.fullname.split(/[ -]+/), firstnames = [], nick, firstname, lastname, bloodtype = 0, bt;
        for(let i = 0; i<name.length; i++)
        {
            if(name[i] != "") {
                name[i] = capFirstLetter(name[i]);
                firstnames.push(name[i]);
            }
        }
        if(firstnames.length > 2 && firstnames[firstnames.length-2].search("\"")>=0)
        {
            nick = firstnames[firstnames.length-2].replace("\"", '');
            nick = nick.replace("\"",'');
            nick = capFirstLetter(nick);
            firstnames.splice(firstnames.length-2, 1);
        }
        firstname = firstnames[0];
        for(let i = 1; i<firstnames.length-1; i++)
            firstname = firstname + " " + firstnames[i];
        let house = st.house.split(" ");
        let i = 0;
        while(house[i] == "")
            i++;
        house[i] = capFirstLetter(house[i]);
        lastname = firstnames[firstnames.length-1];
        for(let j=0; j<halfBloods.length; j++)
            if(halfBloods[j] == lastname)
                bloodtype = 1; //it is half blood
        for(let j=0; j<pureBloods.length; j++)
            if(pureBloods[j] == lastname) {
                if(bloodtype == 0)
                    bloodtype = 2; //it is pure blood
                else
                    bloodtype = 3; //it is half-pure blood
            }
        if(bloodtype == 1)
            bt = "Half Blood";
        else if(bloodtype == 2)
            bt = "Pure Blood";
        else
            bt = "Half-pure Blood";
        if(nick)
            student.push({firstname:firstname, lastname:lastname, nickname:nick, gender:st.gender, house:house[i], bloodtype:bt, picture:lastname.toLowerCase() + "_" + firstname[0].toLowerCase(), prefect:0, expelled:0, inq:0});
        else
            student.push({firstname:firstname, lastname:lastname, gender:st.gender, house:house[i], bloodtype:bt, picture:lastname.toLowerCase() + "_" + firstname[0].toLowerCase(), prefect:0, expelled:0, inq:0});
    });
}

function setBloods(data) {
    data.half.forEach(blood => {
        halfBloods.push(blood);
    });
    data.pure.forEach(blood => {
        pureBloods.push(blood);
    });
}

function capFirstLetter(s) {
    s = s[0].toUpperCase() + s.slice(1).toLowerCase();
    return s;
}