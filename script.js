// Регистрација 

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    let data = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
    };

    if (email.value.trim() === '') {
        showError(email, 'Niste uneli email');
        return; 
    } else {
        hideError(email);
    }

    if (name.value.trim() === '') {
        showError(name, 'Niste uneli ime i prezime');
        return; 
    } else {
        hideError(name);
    }

    if (password.value.trim() === '') {
        showError(password, 'Niste uneli lozinku');
        return; 
    } else {
        hideError(password);
    }

    if (phone.value.trim() !== '' && !/^(\+)[1-9][0-9]{8,13}$/.test(phone.value.trim())) {
        showError(phone, 'Telefon nije ispravan');
    } else {
        hideError(phone);
    }

    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Lozinke se ne poklapaju');
        return; 
    } else {
        hideError(confirmPassword);
    }

    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + 'YaEIKxX7ARY1J0qhvM8kpfz0hseUIJ0CaE2jippbhCYGH6P08fcBy7cvcNht6VNNfxCnV1lAJ2JjCPDhFo5IkJWNcu'
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            let errorDiv = document.getElementById('serverError');
            errorDiv.innerHTML = data.error;
            errorDiv.style.color = 'red';
            document.getElementById('email').value = '';
        } else {
            window.location.href = "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/login";
        }
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });
});

document.getElementById('email').addEventListener('blur', function() {
    if (this.value.trim() === '') {
        showError(this, 'Niste uneli email');
    } else {
        hideError(this);
    }
});

document.getElementById('name').addEventListener('blur', function() {
    if (this.value.trim() === '') {
        showError(this, 'Niste uneli ime i prezime');
    } else {
        hideError(this);
    }
});

document.getElementById('password').addEventListener('blur', function() {
    if (this.value.trim() === '') {
        showError(this, 'Niste uneli lozinku');
    } else {
        hideError(this);
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    if (this.value.trim() !== '' && !/^(\+)[1-9][0-9]{8,13}$/.test(this.value.trim())) {
        showError(this, 'Telefon nije ispravan');
    } else {
        hideError(this);
    }
});

document.getElementById('confirmPassword').addEventListener('blur', function() {
    if (this.value !== document.getElementById('password').value) {
        showError(this, 'Lozinke se ne poklapaju');
    } else {
        hideError(this);
    }
});

function showError(input, message) {
    let id = input.id + 'Error';
    document.getElementById(id).innerHTML = message;
    document.getElementById(id).style.color = 'orange';
    input.style.borderColor = 'orange';
}

function hideError(input) {
    let id = input.id + 'Error';
    document.getElementById(id).innerHTML = '';
    input.style.borderColor = '';
}

// PRIJAVA

document.querySelector("#loginForm form").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let userType = document.getElementById('userType').value;

    if (!email || !password) {
        alert("Oba polja su obavezna!");
        return;
    }

    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YaEIKxX7ARY1J0qhvM8kpfz0hseUIJ0CaE2jippbhCYGH6P08fcBy7cvcNht6VNNfxCnV1lAJ2JjCPDhFo5IkJWNcu'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            user_type: userType
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            document.getElementById('loginPassword').value = ""; // Resetuje polje lozinke
        } else if (data.type && data.token) {
            localStorage.setItem('userToken', data.token); // Čuva token u localStorage
            if (data.type == 'admin') {
                alert("Uspešno ste se prijavili kao administrator!");
                // Ovde preusmeriti korisnika na odgovarajuću stranicu nakon prijave
                window.location.href = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik';
            } else if (data.type == 'cashier') {
                alert("Uspešno ste se prijavili kao blagajnik!");
                window.location.href = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik';
            } else if (data.type == 'registeredUser') {
                alert("Uspešno ste se prijavili kao registrovani korisnik!");            
                window.location.href = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik';
            } else if (data.type == 'blockedUser') {
                alert("Uspešno ste se prijavili kao blokirani korisnik!");            
                window.location.href = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik';
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

});



// kreiranje korisnika


document.getElementById('createUser').addEventListener('submit', function(event) {
    event.preventDefault();

    // preuzimanje vrednosti
    let nameSurname = document.getElementById('nameSurname').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('passwordConfirm').value;
    let role = document.getElementById('role').value;
    let location = document.getElementById('location').value;

    // regularni izrazi za validaciju
    let nameSurnameRegex = /^([A-Ža-ž][a-žA-ž]{2,}(?: [-][A-Ža-ž][a-žA-ž]{2,})+)$/;
    let phoneRegex = /^\+[1-9][0-9]{8,14}$/;
    let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$/;

    // validacija
    if (!nameSurnameRegex.test(nameSurname)) {
        // neispravno ime i prezime
        showError('nameSurname', 'Име и презиме није правилно написано');
    } else if (!email) {
        // neispravan email
        showError('email', 'Нисте унели имејл');
    } else if (phone && !phoneRegex.test(phone)) {
        // neispravan telefon
        showError('phone', 'Телефон није исправан');
    } else if (!passwordRegex.test(password)) {
        // neispravna lozinka
        showError('password', 'Лозинка није довољно јака');
    } else if (password !== passwordConfirm) {
        // lozinke se ne poklapaju
        showError('passwordConfirm', 'Лозинке се не поклапају');
    } else {
        // sve je u redu, pošalji zahtev serveru
    }
});

// funkcija za prikazivanje greške
function showError(field, message) {
    document.getElementById(field).classList.add('error');
    document.getElementById(field + 'Error').textContent = message;
}

// funkcija za sklanjanje greške
function removeError(field) {
    document.getElementById(field).classList.remove('error');
    document.getElementById(field + 'Error').textContent = '';
}



document.getElementById('createUser').addEventListener('submit', function(event) {
    event.preventDefault();

    // preuzimanje vrednosti
    let nameSurname = document.getElementById('nameSurname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('passwordConfirm').value;
    let role = document.getElementById('role').value;

    // regularni izrazi za validaciju
    let nameSurnameRegex = /^([A-Ža-ž][a-žA-ž]{2,}(?: [-][A-Ža-ž][a-žA-ž]{2,})+)$/;
    let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$/;

    // validacija
    if (!nameSurnameRegex.test(nameSurname)) {
        // neispravno ime i prezime
        showError('nameSurname', 'Име и презиме није правилно написано');
    } else if (!email) {
        // neispravan email
        showError('email', 'Нисте унели имејл');
    } else if (!passwordRegex.test(password)) {
        // neispravna lozinka
        showError('password', 'Лозинка није довољно јака');
    } else if (password !== passwordConfirm) {
        // lozinke se ne poklapaju
        showError('passwordConfirm', 'Лозинке се не поклапају');
    } else {
        // sve je u redu, pošalji zahtev serveru
    }
});

// funkcija za prikazivanje greške
function showError(field, message) {
    document.getElementById(field).classList.add('error');
    document.getElementById(field + 'Error').textContent = message;
}

// funkcija za sklanjanje greške
function removeError(field) {
    document.getElementById(field).classList.remove('error');
    document.getElementById(field + 'Error').textContent = '';
}


//kreiranje admina

document.getElementById('createUser').addEventListener('submit', function(event) {
    event.preventDefault();

    // preuzimanje vrednosti
    let nameSurname = document.getElementById('nameSurname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirm = document.getElementById('passwordConfirm').value;
    let role = document.getElementById('role').value;

    // regularni izrazi za validaciju
    let nameSurnameRegex = /^([A-Ža-ž][a-žA-ž]{2,}(?: [-][A-Ža-ž][a-žA-ž]{2,})+)$/;
    let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9]).{6,}$/;

    // validacija
    if (!nameSurnameRegex.test(nameSurname)) {
        // neispravno ime i prezime
        showError('nameSurname', 'Име и презиме није правилно написано');
    } else if (!email) {
        // neispravan email
        showError('email', 'Нисте унели имејл');
    } else if (!passwordRegex.test(password)) {
        // neispravna lozinka
        showError('password', 'Лозинка није довољно јака');
    } else if (password !== passwordConfirm) {
        // lozinke se ne poklapaju
        showError('passwordConfirm', 'Лозинке се не поклапају');
    } else {
        // sve je u redu, pošalji zahtev serveru
    }
});

// funkcija za prikazivanje greške
function showError(field, message) {
    document.getElementById(field).classList.add('error');
    document.getElementById(field + 'Error').textContent = message;
}

// funkcija za sklanjanje greške
function removeError(field) {
    document.getElementById(field).classList.remove('error');
    document.getElementById(field + 'Error').textContent = '';
}


// GET LISTA SVIH ULOGA


// Funkcija za dobijanje broja korisnika po ulogama
function getNumberOfUsersByRole(roleId) {

  }
  
  // Funkcija za prikazivanje liste uloga korisnika
  function showUserRoles(roles) {
    // Pronađite HTML element u kojem će biti prikazana tabela uloga korisnika
    let tableContainer = document.getElementById('userRolesTable');
  
    // Kreirajte HTML tabelu
    let table = document.createElement('table');
    table.classList.add('user-roles-table');
  
    // Kreirajte zaglavlje tabele
    let tableHeader = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let headers = ['Id', 'Naziv', 'Opis', 'Broj korisnika'];
  
    // Kreirajte zaglavlje kolona
    for (let i = 0; i < headers.length; i++) {
      let headerCell = document.createElement('th');
      headerCell.textContent = headers[i];
      headerRow.appendChild(headerCell);
    }
  
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
  
    // Kreirajte telo tabele sa podacima o ulogama korisnika
    let tableBody = document.createElement('tbody');
  
    for (let i = 0; i < roles.length; i++) {
      let role = roles[i];
  
      // Kreirajte red za svaku ulogu
      let row = document.createElement('tr');
  
      // Kreirajte ćelije sa informacijama o ulozi
      let idCell = document.createElement('td');
      idCell.textContent = role.id;
      row.appendChild(idCell);
  
      let nameCell = document.createElement('td');
      nameCell.textContent = role.naziv;
      row.appendChild(nameCell);
  
      let descriptionCell = document.createElement('td');
      descriptionCell.textContent = role.opis;
      row.appendChild(descriptionCell);
  
      let numberOfUsersCell = document.createElement('td');
      let numberOfUsers = getNumberOfUsersByRole(role.id);
      numberOfUsersCell.textContent = numberOfUsers;
      row.appendChild(numberOfUsersCell);
  
      // Dodajte red u telo tabele
      tableBody.appendChild(row);
    }
  
    table.appendChild(tableBody);
  
    // Dodajte tabelu u kontejner
    tableContainer.appendChild(table);
  }
  
  // Napravite HTTP GET zahtev ka listi uloga korisnika
  fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY')
    .then(response => response.json())
    .then(data => {
      // Prikazivanje liste uloga korisnika
      showUserRoles(data);
    })
    .catch(error => {
      console.error('Greška pri dobijanju liste uloga korisnika:', error);
    });
  




    // Funkcija za dobijanje broja događaja za korisnika
function getNumberOfEventsForUser(userId) {

  }
  
  // Funkcija za dobijanje broja rezervisanih ulaznica za korisnika
  function getNumberOfReservedTicketsForUser(userId) {

  }
  
  // Funkcija za dobijanje broja kupljenih ulaznica za korisnika
  function getNumberOfPurchasedTicketsForUser(userId) {

  }
  
  // Funkcija za dobijanje broja otkazanih ulaznica za korisnika
  function getNumberOfCancelledTicketsForUser(userId) {
  
  }
  
  // Funkcija za prikazivanje liste korisnika
  function showUsers(users) {
    // Pronađite HTML element u kojem će biti prikazana tabela korisnika
    let tableContainer = document.getElementById('usersTable');
  
    // Kreirajte HTML tabelu
    let table = document.createElement('table');
    table.classList.add('users-table');
  
    // Kreirajte zaglavlje tabele
    let tableHeader = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let headers = ['Id', 'Име и презиме', 'Имејл', 'Телефон', 'Локација', 'Улога', 'Број догађаја', 'Број резервисаних улазница', 'Број купљених улазница', 'Број отказаних улазница', 'Акција'];
  
    // Kreirajte zaglavlje kolona
    for (let i = 0; i < headers.length; i++) {
      let headerCell = document.createElement('th');
      headerCell.textContent = headers[i];
      headerRow.appendChild(headerCell);
    }
  
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
  
    // Kreirajte telo tabele
    let tableBody = document.createElement('tbody');
  
    // Popunite tabelu podacima o korisnicima
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
  
      let row = document.createElement('tr');
      let idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);
  
      let nameSurnameCell = document.createElement('td');
      nameSurnameCell.textContent = user.nameSurname;
      row.appendChild(nameSurnameCell);
  
      let emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      row.appendChild(emailCell);
  
      let phoneCell = document.createElement('td');
      phoneCell.textContent = user.phone;
      row.appendChild(phoneCell);
  
      let locationCell = document.createElement('td');
      let locationLink = document.createElement('a');
      locationLink.textContent = user.location.name;
      locationLink.href = 'link_to_location_page'; // Dodajte stvarni link ka stranici sa detaljima o lokaciji
      locationCell.appendChild(locationLink);
      row.appendChild(locationCell);
  
      let roleCell = document.createElement('td');
      roleCell.textContent = user.role.name;
      row.appendChild(roleCell);
  
      let numberOfEventsCell = document.createElement('td');
      if (user.role.name === 'благајник') {
        getNumberOfEventsForUser(user.id).then((numberOfEvents) => {
          numberOfEventsCell.textContent = numberOfEvents;
        });
      }
      row.appendChild(numberOfEventsCell);
  
      let numberOfReservedTicketsCell = document.createElement('td');
      if (user.role.name === 'регистровани корисник' || user.role.name === 'блокирани корисник') {
        getNumberOfReservedTicketsForUser(user.id).then((numberOfReservedTickets) => {
          numberOfReservedTicketsCell.textContent = numberOfReservedTickets;
        });
      }
      row.appendChild(numberOfReservedTicketsCell);
  
      let numberOfPurchasedTicketsCell = document.createElement('td');
      if (user.role.name === 'регистровани корисник' || user.role.name === 'блокирани корисник') {
        getNumberOfPurchasedTicketsForUser(user.id).then((numberOfPurchasedTickets) => {
          numberOfPurchasedTicketsCell.textContent = numberOfPurchasedTickets;
        });
      }
      row.appendChild(numberOfPurchasedTicketsCell);
  
      let numberOfCancelledTicketsCell = document.createElement('td');
      if (user.role.name === 'регистровани корисник' || user.role.name === 'блокирани корисник') {
        getNumberOfCancelledTicketsForUser(user.id).then((numberOfCancelledTickets) => {
          numberOfCancelledTicketsCell.textContent = numberOfCancelledTickets;
        });
      }
      row.appendChild(numberOfCancelledTicketsCell);
  
      let actionsCell = document.createElement('td');
      let editButton = document.createElement('button');
      editButton.textContent = 'Измени';
      editButton.addEventListener('click', function() {
        // Preusmerite se na stranicu za izmenu odabranog korisnika
       
      });
      actionsCell.appendChild(editButton);
  
      let deleteButton = document.createElement('button');
      deleteButton.textContent = 'Обриши';
      deleteButton.addEventListener('click', function() {
        // Pošaljite zahtev za brisanje odabranog korisnika
       
      });
      actionsCell.appendChild(deleteButton);
  
      row.appendChild(actionsCell);
  
      tableBody.appendChild(row);
    }
  
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
  }
  
  // Izvršite GET zahtev ka listi korisnika
  fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY')
    .then(response => response.json())
    .then(data => {
      // Prikazivanje liste korisnika
      showUsers(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    




//GET Приказ једног корисника по id-ју

userId = 456; // Zamijenite sa stvarnim ID-om korisnika
const apiUrl = `https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/${userId}?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Ovde možete obraditi podatke o korisniku koji su dobijeni iz odgovora
    console.log(data);
  })
  .catch(error => {
    // Obrada greške u slučaju neuspešnog zahtjeva
    console.error(error);
  });






// PATCH Ажурирање података једног корисника

  const userId = 123; // Zamijenite sa stvarnim ID-om korisnika
apiUrl = `https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/${userId}`;

const data = {
  // Ovdje navedite ažurirane podatke o korisniku
  ime: 'Novo ime',
  prezime: 'Novo prezime',
  email: 'noviemail@example.com',
  // Ostali podaci za ažuriranje
};

fetch(apiUrl, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    // Ovdje dodajte potrebne zaglavlja, kao što je apitoken
    'apitoken': 'qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY',
  },
  body: JSON.stringify(data),
})
  .then(response => response.json())
  .then(data => {
    // Ovdje možete obraditi odgovor sa servera nakon uspješnog ažuriranja
    console.log(data);
    // Prikazati poruku o uspješnom ažuriranju korisniku
    showMessage('Uspješno ste ažurirali podatke.', 'green');
  })
  .catch(error => {
    // Obrada greške u slučaju neuspješnog zahtjeva
    console.error(error);
    // Prikazati poruku o grešci korisniku
    showMessage('Došlo je do greške prilikom ažuriranja podataka.', 'red');
  });

// Funkcija za prikazivanje poruke
function showMessage(message, color) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.color = color;
  // Ovdje dodajte poruku ispod dugmeta ili na odgovarajuće mjesto u vašoj aplikaciji
  document.body.appendChild(messageElement);
}



// brisanje korisnika


// Kreiraj XHR objekat
var xhr = new XMLHttpRequest();

// Definiši metodu i URL zahtjeva
xhr.open('DELETE', 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY', true);

// Postavi header zahtjeva
xhr.setRequestHeader('Content-type', 'application/json');

// Obrada odgovora
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log('Korisnik je uspješno obrisan.');
  } else {
    console.log('Došlo je do greške prilikom brisanja korisnika.');
  }
};

// Pošalji zahtev
xhr.send();




//KREIRANJE LOKACIJE


var dayInputs = document.querySelectorAll('.day');
var startHourInputs = document.querySelectorAll('.hours')[0];
var endHourInputs = document.querySelectorAll('.hours')[1];
var endMinuteInputs = document.querySelectorAll('.minutes')[1];

startHourInputs.addEventListener('input', function() {
  if (this.value.trim() !== '') {
    endHourInputs.disabled = false;
    endMinuteInputs.disabled = false;
  } else {
    endHourInputs.disabled = true;
    endMinuteInputs.disabled = true;
  }
});

for (var i = 0; i < dayInputs.length; i++) {
  dayInputs[i].addEventListener('input', function() {
    if (this.value.trim() !== '') {
      this.parentNode.nextElementSibling.firstElementChild.disabled = false;
      this.parentNode.nextElementSibling.nextElementSibling.firstElementChild.disabled = false;
    } else {
      this.parentNode.nextElementSibling.firstElementChild.disabled = true;
      this.parentNode.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
    }
  });
}


// Funkcija za dobijanje liste svih lokacija





function getAllLocations() {
    // Napraviti GET zahtev ka API-ju za dobijanje liste svih lokacija
    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY')
      .then(response => response.json())
      .then(data => {
        // Pozvati funkciju za prikaz tabele sa lokacijama
        displayLocationsTable(data);
      })
      .catch(error => {
        console.error('Došlo je do greške prilikom dobijanja liste lokacija:', error);
      });
  }
  
  // Funkcija za prikaz tabele sa lokacijama
  function displayLocationsTable(locations) {
    // Selektujte element tabele u koju će se prikazati lokacije
    const table = document.getElementById('locationsTable');
  
    // Prolazak kroz sve lokacije i kreiranje redova tabele
    locations.forEach(location => {
      // Kreiranje novog reda tabele
      const row = document.createElement('tr');
  
      // Kreiranje ćelija za svako polje lokacije
      const idCell = createTableCell(location.id);
      const nameCell = createTableCell(location.naziv);
      const cityCell = createTableCell(location.grad);
      const addressCell = createTableCell(location.adresa);
      const descriptionCell = createTableCell(location.opis);
      const workingHoursCell = createTableCell(formatWorkingHours(location.radnoVreme));
      const cashiersCell = createTableCell(location.blagajnici.length);
      const eventsCell = createTableCell(location.dogadjaji.length);
  
      // Kreiranje ćelije za akcije
      const actionsCell = document.createElement('td');
      const editButton = createActionButton('Izmeni', () => editLocation(location.id));
      const deleteButton = createActionButton('Obriši', () => deleteLocation(location.id));
      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);
  
      // Dodavanje svih ćelija u red
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(cityCell);
      row.appendChild(addressCell);
      row.appendChild(descriptionCell);
      row.appendChild(workingHoursCell);
      row.appendChild(cashiersCell);
      row.appendChild(eventsCell);
      row.appendChild(actionsCell);
  
      // Dodavanje reda u tabelu
      table.appendChild(row);
    });
  }
  
  // Funkcija za kreiranje ćelije tabele sa vrednošću
  function createTableCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    return cell;
  }
  
  // Funkcija za formatiranje radnog vremena
  function formatWorkingHours(workingHours) {
    let formattedHours = '';
    workingHours.forEach(day => {
      const { dan, od, do: until } = day;
      const formattedDay = formatDay(dan);
      const formattedTime = formatTime(od) + '-' + formatTime(until);
      formattedHours += formattedDay + ' ' + formattedTime + '<br>';
    });
    return formattedHours;
  }
  
  // Funkcija za formatiranje dana
  function formatDay(day) {
    const daysOfWeek = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
    return daysOfWeek[day - 1];
  }
  
  // Funkcija za formatiranje vremena
  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return padZero(hours) + ':' + padZero(mins);
  }
  
  // Funkcija za dodavanje nule ispred jednocifrenih brojeva
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }
  
  // Funkcija za kreiranje dugmeta za akciju
  function createActionButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }
  
  // Funkcija za izmenu lokacije
  function editLocation(locationId) {
    // Implementirajte logiku za izmenu odabrane lokacije
    // Na primer, otvorite formu za izmenu lokacije
    console.log('Izmena lokacije sa ID-om:', locationId);
  }
  
  // Funkcija za brisanje lokacije
  function deleteLocation(locationId) {
    // Implementirajte logiku za brisanje odabrane lokacije
    // Na primer, pošaljite DELETE zahtev ka API-ju za brisanje lokacije
    console.log('Brisanje lokacije sa ID-om:', locationId);
  }
  
  // Pozivanje funkcije za dobijanje liste svih lokacija
  getAllLocations();
  



  // PATCH Ажурирање података једне локацијe


  document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Preuzimanje vrednosti iz forme
    var locationId = document.getElementById('locationId').value;
    var locationName = document.getElementById('locationName').value;
    var locationAddress = document.getElementById('locationAddress').value;
    var locationCity = document.getElementById('locationCity').value;
    var locationDescription = document.getElementById('locationDescription').value;
    
    // Kreiranje objekta sa podacima lokacije
    var locationData = {
      id: locationId,
      name: locationName,
      address: locationAddress,
      city: locationCity,
      description: locationDescription
    };
    
    // Slanje zahteva ka serveru
    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify(locationData)
    })
    .then(function(response) {
      if (response.ok) {
        // Poruka o uspešnom ažuriranju podataka
        var successMessage = document.createElement('p');
        successMessage.textContent = 'Podaci su uspešno ažurirani.';
        successMessage.style.color = 'green';
        document.getElementById('locationForm').appendChild(successMessage);
      } else {
        // Poruka o grešci prilikom ažuriranja podataka
        var errorMessage = document.createElement('p');
        errorMessage.textContent = 'Došlo je do greške prilikom ažuriranja podataka.';
        errorMessage.style.color = 'red';
        document.getElementById('locationForm').appendChild(errorMessage);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  });
  




  //DELETE brisanje lokacije


  // Prikaz forme za potvrdu brisanja
function showDeleteConfirmation(locationId) {
    var confirmation = confirm("Da li ste sigurni da želite da obrišete lokaciju?");
  
    if (confirmation) {
      deleteLocation(locationId);
    }
  }
  
  // Brisanje lokacije
  function deleteLocation(locationId) {
    // Slanje DELETE zahteva ka serveru
    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/' + locationId + '?apitoken=qAvhkDxDbnYZRoh8pMLEe6QiTIEUZG2WONzVPcxyiQeJuCMyJpCpjEvxOm6Iq6gVa5jGGXbXLJmsuH85q2teOLhQCY', {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer YOUR_API_TOKEN'
      }
    })
    .then(function(response) {
      if (response.ok) {
        // Poruka o uspešnom brisanju lokacije
        alert("Lokacija je uspešno obrisana.");
        // Dodatne radnje nakon brisanja
        // ...
      } else {
        // Poruka o grešci prilikom brisanja lokacije
        alert("Došlo je do greške prilikom brisanja lokacije.");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  



 //KREIRANJE DOGADJAJA


  document.getElementById('createEventForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    var eventName = document.getElementById('eventName').value;
    var eventLocation = document.getElementById('eventLocation').value;
    var eventDate = document.getElementById('eventDate').value;
    var eventTime = document.getElementById('eventTime').value;
    var eventDescription = document.getElementById('eventDescription').value;
  
    var eventData = {
      eventName: eventName,
      eventLocation: eventLocation,
      eventDate: eventDate,
      eventTime: eventTime,
      eventDescription: eventDescription
    };
  
    createEvent(eventData);
  });
  
  function createEvent(eventData) {
    fetch('https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/dogadjaj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN'
      },
      body: JSON.stringify(eventData)
    })
    .then(function(response) {
      if (response.ok) {
        alert("Događaj je uspešno kreiran.");
        // Dodatne radnje nakon kreiranja događaja
      } else {
        alert("Došlo je do greške prilikom kreiranja događaja.");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  }
  