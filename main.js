const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'HOANG'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playList = $('.playlist')
const currentTime = $('#current-time')
const durationTime = $('#duration-time')
const timeDisplay = $('#time-display')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Mất kết nối",
            singer: "Dương DomicDomic",
            path: "./audio/Dương Domic - Mất Kết Nối  EP 'Dữ Liệu Quý'.mp3",
            image: "https://i.ytimg.com/vi/lRsaDQtYqAo/maxresdefault.jpg"
        },
        {
            name: "Yêu 5",
            singer: "Rhymastic",
            path: "./audio/YÊU 5 - Rhymastic  LYRICS VIDEO.mp3",
            image:
                "https://th.bing.com/th/id/R.446b967b6923822edd64e55a30e85767?rik=aVIAqyKsvGNUyg&pid=ImgRaw&r=0"
        },
        {
            name: "Nightcore - Comes To You",
            singer: "Justin Bieber",
            path:
                "./audio/Nightcore - Comes To You (Speed Up).mp3",
            image: "https://i.ytimg.com/vi/GCP3rWkBr7w/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBS6rI4BrtpC1cy9gLl82HIj3D2dw"
        },
        {
            name: "Lệ lưu ly",
            singer: "VŨ PHỤNG TIÊN",
            path: "./audio/LỆ LƯU LY - VŨ PHỤNG TIÊN X DT TẬP RAP X DRUM7  OFFICIAL MUSIC VIDEO.mp3",
            image:
                "https://i.ytimg.com/vi/0tFUfuEhh28/maxresdefault.jpg"
        },
        {
            name: "Vài lần đón đưa",
            singer: "Soobin Hoàng Sơn",
            path: "./audio/Touliver x Soobin Hoàng Sơn - Vài Lần Đón Đưa ( Cover ).mp3",
            image:
                "https://th.bing.com/th/id/OIP.pzbdSWAdU_n7KS_BkYvMdwHaEK?rs=1&pid=ImgDetMain"
        },
        {
            name: "2AM - JustaTee  feat Big Daddy",
            singer: "JustaTee",
            path:
                "./audio/2AM - JustaTee  feat Big Daddy Official Audio.mp3",
            image:
                "https://th.bing.com/th/id/OIP.JpMw0_mQkh6u25Ph39WecQAAAA?rs=1&pid=ImgDetMain"
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        var htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handlerEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD rotate
        const cdThumbAnimate = cdThumb.animate(
            [
                { transform: 'rotate(360deg)' }
            ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xử lý khi click playy
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi song pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
        
                const currentMinutes = Math.floor(audio.currentTime / 60)
                const currentSeconds = Math.floor(audio.currentTime % 60)
                const durationMinutes = Math.floor(audio.duration / 60)
                const durationSeconds = Math.floor(audio.duration % 60)
                
                const formattedCurrentTime = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`
                const formattedDurationTime = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`
                
                const timeContent = `${formattedCurrentTime} / ${formattedDurationTime}` 
                timeDisplay.textContent = timeContent
            }
        }
        

        // xử lý khi tua
        progress.oninput = function (e) {
            audio.currentTime = audio.duration * e.target.value / 100
        }

        //Xử lý next song
        btnNext.onclick = function () {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý prev song
        btnPrev.onclick = function () {
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }

        //Xử lý random song
        btnRandom.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            btnRandom.classList.toggle('active',_this.isRandom)  
        }

        //Xử lý lặp lại bài hát
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            btnRepeat.classList.toggle('active',_this.isRepeat)  
        }

        //Xử lý next song khi bài hát kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                btnNext.click()
            }
        }

        //Xử lý click song
        playList.onclick = function(e){
            const songElement = e.target.closest('.song:not(.active)')
            if(songElement || e.target.closest('.option')){
                if(songElement){
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()  
                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }, 250)

    }, 
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        progress.value = 0

    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        progress.value = 0

    },
    randomSong: function () {
        var newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        progress.value = 0

    },
    start: function () {
        this.loadConfig()

        this.defineProperties()

        this.handlerEvent()

        this.loadCurrentSong()

        this.render()
         
    }

}
app.start()