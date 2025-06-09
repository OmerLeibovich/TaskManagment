// This block runs once the DOM is fully loaded
$(document).ready(function () {

  // Function to reload the task list from the server, optionally filtered
  const loadTasks = (filter = 'all') => {
    $.get('/', { filter }, function (data) {
      const newList = $(data).find('.list-group').html();
      $('.list-group').html(newList);
    });
  };
  
  

  // Triggers a reload of tasks with the selected filter
  $('.filter-btn').on('change', function () {
    const filter = $(this).val();
    loadTasks(filter);
  });

  
  // Handles submission of the new task form 
  $('#taskForm').on('submit', function (e) {
    e.preventDefault();
    const taskText = $('#taskInput').val().trim();

    // Refocus input field after task is added
    $('input:visible:enabled:first').focus();

    if (taskText === '') return;

    $.ajax({
      url: '/tasks',
      type: 'POST',
      data: { task: taskText },
      success: function (data) {
        $('#taskInput').val('');
        loadTasks($('input.filter-btn:checked').val());
      },
      error: function () {
        alert('cant add task');
      },
    });
  });

  // When checkbox is toggled, update task status on server and reload filtered list
  $(document).on('change', '.form-check-input', function () {
    const taskId = $(this).data('id');
    console.log(taskId)
    $.ajax({
      url: `/tasks/${taskId}/toggle`,
      type: 'POST',
      success: function () {
        loadTasks($('input.filter-btn:checked').val());
      },
      error: function () {
        alert('cant update status');
      }
    });
  });

  // When delete button is clicked, remove the task from the server and reload the list
  $(document).on('click', '.delete-btn', function () {
    const taskId = $(this).data('id');
    $.ajax({
      url: `/tasks/${taskId}`,
      type: 'DELETE',
      success: function () {
        loadTasks($('input.filter-btn:checked').val());
      },
      error: function () {
        alert('cant delete task');
      },
    });
  });

  // When edit is clicked, replace task text with input field and change button to "Save"
  $(document).on('click', '.edit-btn', function () {
    const $li = $(this).closest('li');
    const taskId = $(this).data('id');
    const $span = $li.find('span');
    const currentText = $span.text().trim();

    if ($li.find('input.edit-input').length > 0) return;

    $span.hide();

    const $input = $(`<input type="text" class="form-control form-control-sm edit-input me-2" value="${currentText}" style="width: auto; display: inline-block;">`);
    $span.parent().append($input);

    $input.focus();

    $input.on('keydown', function (e) {
      if (e.key === 'Enter') $li.find('.save-btn').click();
    });

    $(this).text('Save').removeClass('edit-btn btn-success').addClass('save-btn btn-warning');
  });


  // When save is clicked, update the task name on the server and reload the list
  $(document).on('click', '.save-btn', function () {

    $('input:visible:enabled:first').focus();

    const $li = $(this).closest('li');
    const taskId = $(this).data('id');
    const $input = $li.find('input.edit-input');
    const newText = $input.val().trim();

    if (newText === '') return alert('Task name cannot be empty');

    $.ajax({
      url: `/tasks/${taskId}/rename`,
      type: 'POST',
      data: { newText },
      success: function () {
        loadTasks($('input.filter-btn:checked').val());
      },
      error: function () {
        alert('Failed to update task');
      },
    });
  });
});
