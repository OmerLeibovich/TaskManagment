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
            <div class="d-flex">
              <button class="btn btn-success btn-sm me-2 edit-btn" data-id="${data.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${data.id}">Delete</button>
            </div>
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
$(document).on('click', '.edit-btn', function () {
  const $li = $(this).closest('li');
  const taskId = $(this).data('id');
  const $span = $li.find('span');

  if ($li.find('input.edit-input').length > 0) return;

  const currentText = $span.text().trim();
  $span.hide();

  const $container = $span.parent();
  $span.hide();

  const $input = $(`<input type="text" class="form-control form-control-sm edit-input me-2" value="${currentText}" style="width: auto; display: inline-block;">`);
  $container.append($input);


  $(this).text('Save').removeClass('edit-btn btn-success').addClass('save-btn btn-warning');
});

$(document).on('click', '.save-btn', function () {
  const $li = $(this).closest('li');
  const taskId = $(this).data('id');
  const $input = $li.find('input.edit-input');
  const newText = $input.val().trim();
  const $span = $li.find('span');
  const oldText = $span.text().trim();

  if (newText === '') return alert('Task name cannot be empty');

  $.ajax({
    url: `/tasks/${taskId}/rename`,
    type: 'POST',
    data: { newText },
    success: function () {
      $span.text(newText).show();
      $input.remove();

      
      $li.find('.save-btn')
        .text('Edit')
        .removeClass('save-btn btn-warning')
        .addClass('edit-btn btn-success');
    },
    error: function () {
      alert('Failed to update task');
    }
  });
});


