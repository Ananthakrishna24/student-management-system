function addStudent(event) {
  event.preventDefault();

  const formData = {
    fname: $('#fname').val(),
    lname: $('#lname').val(),
    dob: $('#dob').val(),
    parentName: $('#parentName').val(),
    address: $('#address').val(),
    city: $('#city').val(),
    phoneNumber: $('#phoneNumber').val(),
    grade: $('#grade').val(),
  };

  $.ajax({
    type: 'POST',
    url: '/students',
    data: formData,
    success: function () {
      $('#addStudentForm')[0].reset();
      loadStudentTable();
    },
    error: function (error) {
      alert('Error adding student');
      console.error(error);
    },
  });
}

function addMarks(event) {
  event.preventDefault();

  const formData = {
    subjectName: $('#subjectName').val(),
    marks: $('#marks').val(),
    studentId: $('#studentId').val(),
  };

  $.ajax({
    type: 'POST',
    url: '/marks',
    data: formData,
    success: function () {
      $('#addMarksForm')[0].reset();

      loadStudentTable();
    },
    error: function (error) {
      alert('Error adding marks');
      console.error(error);
    },
  });
}

function loadStudentTable() {
  $.ajax({
    type: 'GET',
    url: '/students',
    success: function (response) {
      const studentTable = $('#studentTable tbody');
      studentTable.empty();

      response.forEach((student) => {
        studentTable.append(`
          <tr>
            <td>${student.id}</td>
            <td>${student.fname} ${student.lname}</td>
            <td>${student.dob}</td>
            <td>${student.parentName}</td>
            <td>${student.address}</td>
            <td>${student.city}</td>
            <td>${student.phoneNumber}</td>
            <td>${student.grade}</td>
          </tr>
        `);
      });

      loadAverageMarksTable();
    },
    error: function (error) {
      alert('Error fetching students');
      console.error(error);
    },
  });
}

function loadAverageMarksTable() {
  $.ajax({
    type: 'GET',
    url: '/students/average-marks-greater-than-60',
    success: function (response) {
      const averageMarksTable = $('#averageMarksTable tbody');
      averageMarksTable.empty();

      response.forEach((student) => {
        averageMarksTable.append(`
          <tr>
            <td>${student.id}</td>
            <td>${student.fname} ${student.lname}</td>
            <td>${student.average}</td>
          </tr>
        `);
      });
    },
    error: function (error) {
      alert('Error fetching average marks');
      console.error(error);
    },
  });
}

$(document).ready(function () {
  loadStudentTable();
});

$('#addStudentForm').submit(addStudent);
$('#addMarksForm').submit(addMarks);

$(window).on('hashchange', function () {
  $('.nav-link').removeClass('active');
  $(window.location.hash + 'Link').addClass('active');
});

$(window).trigger('hashchange');
