let student = [];

fetch('https://petlatkea.dk/2021/hogwarts/students.json')
    .then(response => response.json())
    .then(data => setStudents(data));

function setStudents(data) {
    data.forEach(st => {
        let name = st.fullname.split(" "), firstnames = [], nick, firstname;
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
        if(nick)
            student.push({firstname:firstname, lastname:firstnames[firstnames.length-1], nickname:nick, gender:st.gender, house:house[i]});
        else
            student.push({firstname:firstname, lastname:firstnames[firstnames.length-1], gender:st.gender, house:house[i]});
    });
}

function capFirstLetter(s) {
    s = s[0].toUpperCase() + s.slice(1).toLowerCase();
    return s;
}