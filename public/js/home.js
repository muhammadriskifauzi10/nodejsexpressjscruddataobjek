$(document).ready(function () {
  var tableData = $("#datatableData").DataTable({
    processing: true,
    ajax: {
      url: "/datatabledata",
      type: "POST",
      // dataSrc: ""
      dataType: "json",
      data: function (d) {
        d.major = $("#major").val();
        d.minDate = $("#minDate").val();
        d.maxDate = $("#maxDate").val();
      },
    },
    columns: [
      {
        data: "nomor",
      },
      {
        data: "nama",
      },
      {
        data: "jurusan",
      },
      {
        data: "email",
      },
      {
        data: "no_hp",
      },
      {
        data: "aksi",
      },
    ],
    dom: "lBfrtip",
    buttons: [
      {
        extend: "excel",
        text: "Export Excel",
        filename: "data",
        classname: "btn btn-success",
        exportOptions: {
          columns: [0, 1, 2, 3, 4],
          modifier: {
            search: "none",
          },
        },
      },
    ],
    // "order": [
    //     [1, 'asc']
    // ],
    // scrollY: "700px",
    scrollX: true,
    // scrollCollapse: true,
    // paging:         false,
    // fixedColumns: {
    //     left: 3,
    // }
  });

  $("#major, #minDate, #maxDate").change(function () {
    tableData.ajax.reload();
  });
});
