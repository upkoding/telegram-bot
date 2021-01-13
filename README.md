# UpKodingBot

Bot sederhana yang dibuat untuk menghubungkan [Channel Youtube UpKoding](https://youtube.com/c/UpKoding) dengan [Group Telegram UpKoding](https://t.me/upkoding). Ketika video dipublish di Channel UpKoding, bot ini akan memposting link video tersebut ke Telegram Group UpKoding.

Namun fiturnya tidak akan berhenti disitu saja, saya ingin bot ini bermanfaat buat semua yang bergabung di group telegram kita, jadi apabila ada ide fitur menarik silahkan buat di bagian issue untuk feature request.

### Cara kerja

Bot ini dijalankan sebagai [Firebase Functions](https://firebase.google.com/docs/functions) dan menggunakan [Firestore](https://firebase.google.com/docs/firestore) sebagai databasenya. **Kenapa perlu database?** karena bot memerlukan tempat untuk menyimpan dan membaca state supaya berjalan dengan baik.

**Bagaimana bot tau bahwa ada video baru diupload?** Bot ini memanfaatkan layanan [Pubsubhubbub](https://pubsubhubbub.appspot.com) dari Google yang memungkinkan kita untuk subscribe ke RSS feed dan ketika ada konten baru, Pubsubhubbub ini akan memanggil webhook di bot ini dan mempostingnya ke group telegram.

### Apa bot ini bisa dipakai untuk Channel YT dan Group Telegram saya?

Silahkan, untuk menggunakanya kamu perlu punya akun Firebase namun saat ini saya belum sempat membuatkan cara instalasi secara lengkap. Apabila perlu bantuan untuk instalasi silahkan hubungi [@ekaputra07](https://github.com/ekaputra07).
