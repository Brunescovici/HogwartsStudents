let student = [];

fetch('https://petlatkea.dk/2021/hogwarts/students.json')
    .then(response => response.json())
    .then(data => setStudents(data));

function setStudents(data) {
    data.forEach(st => {
        let name = st.fullname.split(" "), firstnames = [], nick, firstname;
        console.log(data.length);
        for(let i = 0; i<name.length; i++)
        {
            console.log(name[i]);
            name[i] = capFirstLetter(name[i]);
            firstnames.push(name[i]);
        }
        if(firstnames[firstnames.length-1].search("\"")>=0)
        {
            nick = firstnames[firstnames.length-1].replace("\"", '');
            firstnames.splice(firstnames.length-1, 1);
        }
        firstname = firstnames[0];
        for(let i = 1; i<firstnames.length; i++)
            firstname = firstname + " " + firstnames[i];
        if(nick>null)
            student.push({firstname:firstname, nickname:nick});
        else
            student.push({firstname:firstname});
    });
}

function capFirstLetter(s) {
    s = s[0].toUpperCase() + s.slice(1);
    return s;
}