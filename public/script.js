$(document).ready(function () {
  console.log('script loaded');

  $('#taskForm').on('submit', function (e) {
    e.preventDefault();
    const taskText = $('#taskInput').val().trim();

    if (taskText === '') return;

    $.ajax({
      url: '/tasks',
      type: 'POST',
      data: { task: taskText },
      success: function (data) {
        $('#taskInput').val('');
        $('.list-group').append(`
            <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${data.id}">
              <div>
                <input type="checkbox" class="form-check-input me-2" data-id="${data.id}">
                <span>${data.name}</span>
              </div>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${data.id}">Delete</button>
            </li>
          `);
      },
    }).fail(function () {
      alert('cant add task');
    });
  });
  });
  
$(document).on('change', '.form-check-input', function () {
    const taskId = $(this).data('id');

    $.post(`/tasks/${taskId}/toggle`, function () {

    }).fail(function () {
      alert('cant update status');
    });
  });

$(document).on('click', '.delete-btn', function () {
    const taskId = $(this).data('id');
    $.ajax({
      url: `/tasks/${taskId}`,
      type: 'DELETE',
      success: function () {
        $(`li[data-id="${taskId}"]`).remove();
      },
      error: function () {
        alert('cant delete task');
      }
    });
  });
