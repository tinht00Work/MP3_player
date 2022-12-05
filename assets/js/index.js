/**
 * Công việc cần làm:
 * 1.
 *
 *
 *  */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $(".playlist");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $("#progress");
const playBtn = $(".btn-toggle-play");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const currentTime = $(".current-time");
const totalTime = $(".total-time");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const song = $(".song");
const PLAYER_STORAGE_KEY = "F8_PLAYER";
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Blank Space",
      singer: "Taylor Swift",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Taylor%20Swift-Blank%20Space.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/blank_space.jpg",
    },
    {
      name: "Safe & Sound",
      singer: "Taylor Swift",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Safe%20And%20Sound-Taylor%20Swift.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/SafeAndSound.png",
    },
    {
      name: "Back To December",
      singer: "Taylor Swift",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Taylor%20Swift-Back%20To%20December.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/BackToDecember.png",
    },
    {
      name: "Begin Again",
      singer: "Taylor Swift",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Taylor%20Swift-Begin%20Again.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/BeginAgain.png",
    },
    {
      name: "Everything Has Changed",
      singer: "Taylor Swift (feat. Ed Sheeran)",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Taylor%20Swift-Everything%20Has%20Changed%20ft%20Ed%20Sheeran.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/Everythinghaschanged.png",
    },
    {
      name: "The Joker & The Queen",
      singer: "Ed Sheeran (feat. Taylor Swift)",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/The%20Joker%20And%20The%20Queen.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/TheJokerAndTheQueen.png",
    },

    {
      name: "Dynasty",
      singer: "MIIA",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/MIIA%20%20Dynasty%20Lyrics.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/Dynasty.png",
    },

    {
      name: "SAKURA",
      singer: "Ikimono Gakari",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/IkimonoGakari-SAKURA.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/Sakura.jpg",
    },
    {
      name: "Hana No Atosaki",
      singer: "Mao",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/HanaNoAtosaki-Mao.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/HanaNoAtosaki.jpg",
    },
    {
      name: "Rain",
      singer: "The Garden of Words OST",
      path: "https://github.com/tinht00Work/MP3_player/blob/main/assets/musics/Rain%20OST%20Garden%20of%20Words%20lyric.mp3",
      image: "https://github.com/tinht00Work/MP3_player/blob/main/assets/images/Rain_TheGardenOfWord.jpg",
    },
  ],
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  handleEvents: function () {
    const _this = this;
    dashBoardBgr = $(".dashboard").style.background;

    // Xử lý phóng to / thu nhỏ CD + playlist khi scroll
    playlist.onscroll = function () {
      const scrollTop = playlist.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      playlist.style.maxHeight =
        newCdWidth > 0 ? 425 - cd.offsetWidth + "px" : 425 + "px";
      playlist.style.maxHeight = 425 - cd.offsetWidth + "px";
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý CD xoay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý khi click play
    playBtn.onclick = function () {
      // Xử lý play / pause
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi đang play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
      $('title').textContent = _this.currentSong.name;
    };

    // Khi bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Xử lý phút:giây hiện tại
    const currentTimeSong = function () {
      // phút hiện tại
      const currentMinutes = Math.floor(audio.currentTime / 60);
      // giây/phút hiện tại
      const currentSeconds =
        Math.floor(audio.currentTime - currentMinutes * 60) < 10
          ? "0" + Math.floor(audio.currentTime - currentMinutes * 60)
          : Math.floor(audio.currentTime - currentMinutes * 60);
      currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
    };
    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;

        currentTimeSong();

        // !---------------- tổng time ------------------
        // tổng số phút bài hát
        const totalMinutes = Math.floor(audio.duration / 60);
        // số giây/phút của totalTime được hiển thị
        const totalSeconds =
          Math.floor(audio.duration - totalMinutes * 60) < 10
            ? "0" + Math.floor(audio.duration - totalMinutes * 60)
            : Math.floor(audio.duration - totalMinutes * 60);
        // time tổng m:s
        totalTime.textContent = `${totalMinutes}:${totalSeconds}`;
        // !---------------- tổng time ------------------
      }
    };

    // Xử lý khi tua song: %/100*duration
    progress.onchange = function (e) {
      // time khi tua
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;

      currentTimeSong();
    };

    // reset thanh tiến trình bài hát khi load lại trang
    window.onload = function () {
      progress.value = 0;
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");
      if (songElement) {
        // Khi click vào song
        _this.currentIndex = Number(songElement.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };

    // Khi click vào nút next
    nextBtn.onclick = function () {
      _this.nextSong(); // _this=app
      audio.play();
      _this.render();
    };
    // Khi click vào nút prev
    prevBtn.onclick = function () {
      _this.prevSong(); // _this=app
      audio.play();
      _this.render();
    };
    // Xử lý bật/tắt btn-random
    randomBtn.onclick = function () {
      // ? tên bài hát đang phát trước khi click btn-random
      let songBeforeRandom = _this.songs[_this.currentIndex].name;

      if (_this.isRandom) {
        _this.isRandom = false;
        randomBtn.classList.remove("active");
        // window.location.reload();
      } else {
        _this.isRandom = true;
        randomBtn.classList.add("active");
        _this.playRandomSong();

        // ? Vị trí mới của bài hát trước khi random
        const indexOfSongBeforeRandom = _this.songs.findIndex((song) => {
          return song.name === songBeforeRandom;
        });
        _this.currentIndex = indexOfSongBeforeRandom;
      }
      _this.render();

      // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
      // lưu hành động bật/tắt chức năng vào local-storage
      // _this.setConfig("isRandom", _this.isRandom);
      // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
    };

    // Xử lý next song khi audio ended
    audio.onended = function () {
      nextBtn.click();
    };

    // Xử lý repeat song
    repeatBtn.onclick = function () {
      if (_this.isRepeat) {
        audio.loop = false;
      } else {
        audio.loop = true;
      }
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);

      // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
      // lưu hành động bật/tắt chức năng vào local-storage
      // _this.setConfig("isRepeat", _this.isRepeat);
      // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
    };
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index = '${index}'>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="${
            index === this.currentIndex ? "fab fa-deezer" : "fas fa-music"
          }"></i>
        </div>
      </div>`;
    });
    playlist.innerHTML = htmls.join("");
    this.scrollToActiveSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 200);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

    

    // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
    // lưu hành động bật/tắt chức năng vào local-storage
    //  this.setConfig("prevIndex", this.currentIndex);
    // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
  },
  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    const randomSong = this.songs.sort(() => Math.random() - 0.5);
    // lưu playlist random trước đó vào local-storage
    //  this.setConfig("prevRandomPlaylist", this.currentIndex);
    return randomSong;
  },
  // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
  // loadConfig: function () {
  // this.isRandom = this.config.isRandom;
  // this.isRepeat = this.config.isRepeat;
  // this.currentIndex = this.config.prevIndex;
  // this.playRandomSong() = this.config.prevPlaylist
  // this.render();
  //   randomBtn.classList.toggle("active", this.isRandom);
  //   repeatBtn.classList.toggle("active", this.isRepeat);
  // },
  // ! -- Chức năng lưu cấu hình vào local-storge....khi load lại trang vẫn giữ nguyên cấu hình cũ --
  start: function () {
    // * Lắng nghe / Xử lý các sự kiện (DOM events)
    this.handleEvents();

    // * Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // * Render playlist
    this.render();

    // * Gán cấu hình từ config vào ứng dụng
    // this.loadConfig();

    // * Load thông tin bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();
  },
};
app.start();
