$(document).ready(function () {
  console.log('script loaded');

  // שליחת טופס הוספת משימה ב-AJAX
  $('#taskForm').on('submit', function (e) {
    e.preventDefault();
    const taskText = $('#taskInput').val().trim();

    if (taskText === '') return;

    $.post('/tasks', { task: taskText }, function (data) {
      $('#taskInput').val('');
      $('.list-group').append(`
        <li class="list-group-item" data-id="${data.id}">
          <input type="checkbox" class="form-check-input" data-id="${data.id}">
          <span>${data.name}</span>
        </li>
      `);
    }).fail(function () {
      alert('שגיאה בהוספת משימה');
    });
  });

  // סימון משימה כבוצעה / לא בוצעה
  $(document).on('change', '.form-check-input', function () {
    const taskId = $(this).data('id');

    $.post(`/tasks/${taskId}/toggle`, function () {
      // אפשר להוסיף class או לעדכן סגנון במקום לרענן
    }).fail(function () {
      alert('שגיאה בעדכון סטטוס');
    });
  });

  // (אופציונלי) מחיקת משימה
  $(document).on('click', '.delete-btn', function () {
    const taskId = $(this).data('id');

    $.ajax({
      url: `/tasks/${taskId}`,
      type: 'DELETE',
      success: function () {
        $(`li[data-id="${taskId}"]`).remove();
      },
      error: function () {
        alert('שגיאה במחיקת משימה');
      }
    });
  });
});
