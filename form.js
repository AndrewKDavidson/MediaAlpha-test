// classList (would be json data from server)
var classList = [
  {
    study: "Sports",
    classSchedule: [
      {
        start: "Jul 23 2020",
        end: "Aug 23 2020"
      },
      {
        start: "Aug 26 2020",
        end: "Sep 23 2020"
      }
    ]
  },
  {
    study: "Art",
    classSchedule: [
      {
        start: "May 10 2020",
        end: "Jun 10 2020"
      },
      {
        start: "Jul 11 2020",
        end: "Aug 11 2020"
      }
    ]
  },
  {
    study: "Literature",
    classSchedule: [
      {
        start: "Jul 11 2020",
        end: "Oct 11 2020"
      }
    ]
  },
  {
    study: "Music",
    classSchedule: [
      {
        start: "Jun 09 2020",
        end: "Jul 09 2020"
      },
      {
        start: "Aug 09 2020",
        end: "Sep 09 2020"
      }
    ]
  }
];

// function to run on page load
$(document).ready(function() {
  addStudySelect();
  addEventListeners();
});

// this will hold an array of people objects
var personList = [];

// constructor function for new person
function Person(name, email, birthday, classes) {
  this.name = name;
  this.email = email;
  this.birthday = birthday;
  this.classes = classes;
}

// click event listener for submit button
function addEventListeners() {
  $("#submit").click(function(e) {
    e.preventDefault();

    addUser();
  });

  // click handler for study button
  $('body').on('change', '.study', function(e) {
    appendClassSelector(e);
  });

  // click handler for adding new study
  $("#add-study").click(function() {
    addStudySelect();
  });
}

// add study select to page
function addStudySelect() {
  $(
    "<p>Select an Area of Study (multiple allowed)</p>"
  ).appendTo("#all-classes");
  $('#all-classes').append(`<div id='class-group-${$("div[id^='class-group-']").length + 1}'></div>`)
  var select = $("<select>")
    .appendTo(`#class-group-${$("div[id^='class-group-']").length}`)
    .attr("class", `study`)
    .attr("id", `classes-${$(".study").length}`)
    .append($("<option>"))
  $(classList).each(function() {
    select.append(
      $("<option>")
        .attr("value", this.study)
        .text(this.study)
    );
  });
}

function appendClassSelector(e) {

  // current selected study selector
  var currentStudy = e.target
  // check if last select is a class picker
  console.log(currentStudy)
  if($(currentStudy).closest('div').find('.classSelector').length > 0) { 
    return;
  } else {
    $("<p>Please select a class for your study</p>").appendTo(currentStudy);
    $(currentStudy).closest('div').append('<select class="classSelector"></select>');
    var studyVal = $(currentStudy).val();
  
    // return object that matches selected value
    var result = classList.find(obj => {
      return obj.study === studyVal;
    })
    console.log(result.classSchedule)
    var classSchedule = result.classSchedule;
   
    // iterate over each class available and append to select
    $(classSchedule).each(function() {
      $(currentStudy).closest('div').find('.classSelector').append(
        $("<option>")
          .attr("value", `${this.start}, ${this.end}`)
          .text(`${this.start} to ${this.end}`)
      );
    });
  }
  }

//add a user to the Person array
function addUser() {  
  // grab form values
  var name = $("#name").val();
  var email = $("#email").val();
  var birthday = $("#birthday").val();

  // mapping over classes to add to classes array
  var classes = []; 
  var studies = $("form .study");
  $(studies).each(function(i, study) {
    var chosenClass = $(study).closest('div').find('.classSelector')
      return classes.push({
          study: $(study).val(),
          chosenClass: $(chosenClass).val()
      });
  });

  // continue if form is validated
  if(validateForm(name, email, birthday, classes)){
    var person = new Person(name, email, birthday, classes);
    // push new person to array
    personList.push(person);
    console.log(personList);
  
    //convert personList into JSON object array
    var jsonOutput = JSON.stringify(personList);
    console.log(jsonOutput);
  }
}

//validate for completed form
function validateForm(name, email, birthday, classes) {
  var nameError = $('#name_error');
  var emailError = $('#email_error');
  var birthdayError = $('#birthday_error');
  var classesError = $('#classes_error');

  var error = 0;
  $('#name_error').html('');
  if (name == null || name == "") {
      error++;
      nameError.html('Name must be filled out');
  }

  $('#email_error').html('');
  if (email == null || email == "") {
      error++;
      emailError.html('Email must be filled out');
  //search the array for the same email to avoid duplicate entries
  } else if (personList.find(p => p.email === email)) {
    error++;
    emailError.html('This email has already been registered for classes');
  }

  $('#birthday_error').html('');
  if (birthday == null || birthday == "") {
      error++;
      birthdayError.html('Birthday must be filled out');
  }

  $('#classes_error').html('');
  if (classes === undefined || classes.length == 0) {
      error++;
      classesError.html('At least one class must be selected');
  }

  if(error>0) {
      return false;
  }
  // confirm data before submitting the form
  return confirm(
  `Please confirm all information is correct before submitting. 

  First and Last Name: ${name},
  Email Address: ${email},
  Birthday: ${birthday},
  Classes Selected: ${JSON.stringify(classes, null, 4)}
  
  Do you really want to submit the form?`);
}