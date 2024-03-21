// Core modules
const fs = require("fs");

// Local modules
const { loadData, createData } = require("./controllers/home");
const { findData, editData } = require("./controllers/edit");

// Third party modules
const express = require("express");
const app = express();
const port = 8001;
const { body, validationResult } = require("express-validator");
const validator = require("validator");
const moment = require("moment");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.static("public"));

app.use(
  session({
    // cookie: {
    //   maxAge: 6000,
    // },
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(expressLayouts);

// Halaman Home
app.get("/", (req, res) => {
  const formatDate = moment().format("YYYY-MM-DD");
  res.render("home", {
    layout: "main",
    extractScripts: true,
    title: "Halaman Home",
    formatDate,
    data: loadData(),
  });
});

app.post("/datatabledata", (req, res) => {
  const major = req.body.major;
  const minDate = req.body.minDate;
  const maxDate = req.body.maxDate;

  let no = 1;
  var output = [];
  loadData().map((value) => {
    const valueDate = moment(value.tanggal).format("YYYY-MM-DD");

    if (
      (!minDate || valueDate >= moment(minDate).format("YYYY-MM-DD")) &&
      (!maxDate || valueDate <= moment(maxDate).format("YYYY-MM-DD")) &&
      (major === "Pilih Jurusan" || value.jurusan === major)
    ) {
      var aksi =
        `
          <div class="d-flex align-items-center gap-1">
            <a href="edit/` +
        value.id +
        `" class="btn btn-warning text-light btn-same-width">Edit</a>
                |
            <form action="delete/` +
        value.id +
        `" method="POST">
              <button type="submit"
                class="btn btn-danger btn-same-width">Hapus</button>
            </form>
          </div>
        `;

      output.push({
        nomor: no++,
        nama: value.nama,
        jurusan: value.jurusan,
        email: value.email,
        no_hp: value.no_hp,
        aksi,
      });
    }
  });

  res.json({
    data: output,
  });
});

// Halaman Create
app.get("/create", (req, res) => {
  res.render("create", {
    layout: "main",
    extractScripts: true,
    title: "Halaman Buat Data",
    msg: req.flash("msg"),
    old: {
      nama: "",
      email: "",
      no_hp: "",
    },
    msgError: {},
  });
});

// Post data
app.post(
  "/create",
  body("nama", "Nama wajib diisi").notEmpty(),
  body("email").custom((value) => {
    if (validator.isEmpty(value)) {
      throw new Error("Email wajib diisi");
    }
    if (!validator.isEmail(value)) {
      throw new Error("Email tidak valid");
    }
    // Validasi berhasil
    return true;
  }),
  body("no_hp").custom((value) => {
    if (validator.isEmpty(value)) {
      throw new Error("No Hp wajib diisi");
    }
    if (!validator.isMobilePhone(value, "id-ID")) {
      throw new Error("No HP tidak valid");
    }
    // Validasi berhasil
    return true;
  }),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("create", {
        layout: "main",
        extractScripts: true,
        title: "Halaman Buat Data",
        msg: req.flash("msg"),
        old: {
          nama: req.body.nama,
          email: req.body.email,
          no_hp: req.body.no_hp,
        },
        msgError: result.mapped(),
      });
    } else {
      const data_baru = {
        nama: req.body.nama,
        jurusan: req.body.jurusan,
        email: req.body.email,
        no_hp: req.body.no_hp,
        tanggal: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      const data_objek = loadData();

      const id = data_objek.length > 0 ? data_objek.length + 1 : 1;

      const data_baru_init = {
        id: id,
        ...data_baru,
      };

      data_objek.push(data_baru_init);

      createData(data_objek);

      req.flash("msg", "Data berhasil ditambahkan");
      res.redirect("/create");
    }
  }
);

// Halaman Put
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  const data = findData(id);

  res.render("edit", {
    layout: "main",
    extractScripts: true,
    title: "Halaman Edit Data",
    id,
    data,
    msg: req.flash("msg"),
    old: {
      nama: "",
      email: "",
      no_hp: "",
    },
    msgError: {},
  });
});

// Post data
app.post(
  "/edit/:id",
  body("nama", "Nama wajib diisi").notEmpty(),
  body("email").custom((value) => {
    if (validator.isEmpty(value)) {
      throw new Error("Email wajib diisi");
    }
    if (!validator.isEmail(value)) {
      throw new Error("Email tidak valid");
    }
    // Validasi berhasil
    return true;
  }),
  body("no_hp").custom((value) => {
    if (validator.isEmpty(value)) {
      throw new Error("No Hp wajib diisi");
    }
    if (!validator.isMobilePhone(value, "id-ID")) {
      throw new Error("No HP tidak valid");
    }
    // Validasi berhasil
    return true;
  }),
  (req, res) => {
    const id = req.params.id;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const data = findData(id);

      res.render("edit", {
        layout: "main",
        extractScripts: true,
        title: "Halaman Edit Data",
        id,
        data,
        msg: req.flash("msg"),
        old: {
          nama: req.body.nama,
          email: req.body.email,
          no_hp: req.body.no_hp,
        },
        msgError: result.mapped(),
      });
    } else {
      const data_baru = {
        nama: req.body.nama,
        jurusan: req.body.jurusan,
        email: req.body.email,
        no_hp: req.body.no_hp,
        tanggal: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      const data_objek = loadData();

      const edit_data_objek = data_objek.filter((value) => value.id != id);

      const data_edit_init = {
        id: id,
        ...data_baru,
      };

      edit_data_objek.push(data_edit_init);

      editData(edit_data_objek);

      req.flash("msg", "Data berhasil diperbarui");
      res.redirect("/edit/" + id);
    }
  }
);

// Delete data
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;

  // Membaca file data.json
  fs.readFile("./model/data.json", (err, data_model) => {
    if (err) {
      console.error("Gagal membaca file data:", err);
      res.status(500).send("Terjadi kesalahan pada server.");
      return;
    }

    const data_objek = JSON.parse(data_model);

    const delete_data = data_objek.filter((value) => value.id != id);

    // Menyimpan file data.json
    fs.writeFile("./model/data.json", JSON.stringify(delete_data), (err) => {
      if (err) {
        console.error("Gagal menghapus data:", err);
        res.status(500).send("Terjadi kesalahan pada server.");
        return;
      }
      console.log("Data berhasil dihapus.");
      res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
