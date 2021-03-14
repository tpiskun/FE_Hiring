document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  //document.querySelector('#sent').addEventListener('click', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#button-view').style.display = 'none';
  document.querySelector('#inbox-view').innerHTML = '';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  //Load Composed Email Data
  document.querySelector('#compose-form').onsubmit = function() {
      // Create new item for list
      let recipeint = document.querySelector('#compose-recipients').value;
      let subject = document.querySelector('#compose-subject').value;
      let body = document.querySelector('#compose-body').value;

      fetch("/emails", {
        method: 'POST',
        body: JSON.stringify({
        recipients: recipeint,
        subject:  subject,
        body: body
        })
      })
      .then((response) => response.json())
      .then((result) => {
       // Print result
        alert(JSON.stringify(result));
      });
      event.preventDefault();
      load_mailbox('sent');
  }
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#inbox-view').innerHTML = '';
  document.querySelector('#button-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Get Inbox Emails
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
    // Print emails
    for (x in emails){
          let id = emails[x].id;
          let sender = emails[x].sender;
          let timestamp = emails[x].timestamp;
          let subject = emails[x].subject;
          let read = emails[x].read;
          let item = `<span1>${sender}</span1>` + '  ' + subject + `<span>${timestamp}</span>`;
          var color = '';
          //Create div
          const element = document.createElement('div');
          element.innerHTML = item;
          element.addEventListener('click', function(event) {
            read_email(id, event);
            isRead(id, event);
          });
          element.className=`email${x}`;
          document.querySelector('#inbox-view').append(element);

          //Update Email Style Formatting
          if (read === true) {
            document.querySelector(`.email${x}`).style.background = '#c3c9c6';
            document.querySelector(`.email${x}`).style.border = '1px solid black';
            document.querySelector(`.email${x}`).style.margin = '1px';
            document.querySelector(`.email${x}`).style.padding = '5px';
          }
          else{
            document.querySelector(`.email${x}`).style.background = 'white';
            document.querySelector(`.email${x}`).style.border = '1px solid black';
            document.querySelector(`.email${x}`).style.margin = '1px';
            document.querySelector(`.email${x}`).style.padding = '5px';
          }
        }
    });
}

function read_email(id, event){
  //show the email view
  event.preventDefault();
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#inbox-view').innerHTML = '';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#button-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    //Change Header to Subject Content
    document.querySelector('#emails-view').innerHTML = ``;

    //Create Sender & Body Content
    const sender = document.createElement('div');
    sender.innerHTML = `<h6>From: ${email.sender}</h6>`;

    const recipients = document.createElement('div');
    recipients.innerHTML = `<h6>To: ${email.recipients}</h6>`;

    const subject = document.createElement('div');
    subject.innerHTML = `<h6>Subject: ${email.subject}</h6>`;

    const timestamp = document.createElement('div');
    timestamp.innerHTML = `<h6>Timestamp: ${email.timestamp}</h6>`;

    const body = document.createElement('div');
    body.innerHTML = `<p>${email.body}<p>`;

    const hr = document.createElement('hr');
    const br = document.createElement('br');
    //Pull Archive Details
    var status = email.archived;
    console.log(`initial status: ${status}`);

    //Print Details
    document.querySelector('#emails-view').append(sender);
    document.querySelector('#emails-view').append(recipients);
    document.querySelector('#emails-view').append(subject);
    document.querySelector('#emails-view').append(timestamp);
    document.querySelector('#emails-view').append(br);
    document.querySelector('#emails-view').append(body);
    document.querySelector('#emails-view').append(hr);
    document.querySelector('#archive').onclick = () => {
      //console.log(`email id ${id}`);
      isArchived(id, event);
    }
    document.querySelector('#reply').addEventListener('click', function(event) {
      reply_email(email.subject, email.sender, email.body, email.timestamp, event);
    });
  });
}

function isRead(id, event){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function isArchived(id , event){
  event.preventDefault();
  //Check current archive Status
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Check Archive Status
    var button = '';
    var status = email.archived;
    console.log(`initial status: ${status}`);

    //Toggle Status on Click
    if (status===true) {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      //button = document.getElementById("inbox");
      //load_mailbox('inbox');

    } else if (status===false) {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      //button = document.getElementById("archived");
      //load_mailbox('archive');
    }
    //return button.click();
    load_mailbox('inbox');
  });
}

function reply_email(subject, sender, body, timestamp, event){
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#button-view').style.display = 'none';
  document.querySelector('#inbox-view').innerHTML = '';

  // Pre Fill Form
  document.querySelector('#compose-recipients').value = sender;
  var reply_subject;
  if (subject.includes('RE: ')) {
      reply_subject = subject;
      console.log('should print');
  } else {
      reply_subject = 'RE: ' + subject;
      console.log('should not print')
  }

  document.querySelector('#compose-subject').value = reply_subject;
  let reply_body = `\n \n On ${timestamp} ${sender} wrote: \n ${body}`;
  document.querySelector('#compose-body').value = reply_body;

  //Get values from form
  let form_recipeint = document.querySelector('#compose-recipients').value;

  document.querySelector('#compose-form').onsubmit = function(event) {
    let form_body = document.querySelector('#compose-body').value;
    fetch("/emails", {
      method: 'POST',
      body: JSON.stringify({
      recipients: sender,
      subject:  reply_subject,
      body: form_body
      })
    })
    .then((response) => response.json())
    .then((result) => {
     // Print result
      alert(JSON.stringify(result));
    });
    event.preventDefault();
    load_mailbox('sent');
  }
}
