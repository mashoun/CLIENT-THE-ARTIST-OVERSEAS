var app = Vue.createApp({
    data() {
        return {
            api:'https://script.google.com/macros/s/AKfycby2sZEHg6ZtsZHXbUYJJfa4CIU3y2HBwBGhmtNKxTXzltvLHVgi7Z102UCgJO__aTAARw/exec',
            tabs: '',
            sub: '',
            newsletter: '',
            company: 'The Artist Overseas',
            // send a message form
            message: '',
            subject: '',
            username: '',
            useremail: '',
            profile: [],
            currentTab: '',
            currentList: '',
            spinner: true,
            lang: 'arb',
            development: true,
            dir:'rtl'
        }
    },
    methods: {
        trancate(text, size) {
            // it trancate n number of words
            // var n = 20
            // var text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non neque nesciunt et. Exercitationem quam corrupti officia expedita aspernatur eveniet fugiat repudiandae quos? Harum omnis molestias eos quia, in illum incidunt exercitationem, enim possimus quasi laboriosam ut! Alias provident consequatur dicta.'
            // console.log(text.split(' ',20))
            if (text.length < size) return text += ' . . . '
            else {

                var words = text.split(' ', size)
                var trancatedText = ''
                words.forEach(word => {
                    trancatedText += word + ' '
                })
                // trancatedText += ' ...'
                // console.log(trancatedText)
                return trancatedText
            }
        },
        initTarjama(res) {

            this.profile.heading = this.tarjem(res.heading)
            this.profile.bio = this.tarjem(res.bio)
            this.profile.about1 = this.tarjem(res.about1)
            this.profile.about2 = this.tarjem(res.about2)
            this.profile.mission = this.tarjem(res.mission)
            this.profile.vision = this.tarjem(res.vision)

            // SERVICES
            this.profile.services.forEach(e => {
                // console.log(e)
                e.title = this.tarjem(e.title)
                e.description = this.tarjem(e.description)
            });
            // FAQ
            this.profile.faq.forEach(e => {
                // console.log(e)
                e.question = this.tarjem(e.question)
                e.answer = this.tarjem(e.answer)
            });
            // Media
            this.profile.tabs.forEach(tab => {
                this.profile.media[tab].forEach(e => {

                    e.title = this.tarjem(e.title)
                    e.description = this.tarjem(e.description)
                })
            });

        },
        toggleLanguage(lang) {
            this.spinner = true
            this.lang = lang
            if(lang == 'arb') this.dir = 'rtl'
            if(lang == 'eng') this.dir = 'ltr'

            fetch(this.api).then(res => res.json()).then(res => {
                console.log(res)
                this.profile = res
                this.spinner = false
                this.getAllMedia()
                this.sub = this.api + '?subscribe=1'
                this.initTarjama(res)
            })
        },
        // tarjem(text) {
        //     // console.log(text.indexOf(`${this.lang}::`))
        //     text = text.slice(text.indexOf(`${this.lang}::`), text.length)
        //     // console.log(text.indexOf(';;'))
        //     // console.log(text.slice(0 + 5, text.indexOf(';;')))
        //     return text.slice(0 + 5, text.indexOf(';;'))
        // },

        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text) {
            var lang = this.lang
            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        },
        subscribe() {
            fetch(this.sub, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: this.newsletter
            }).then(res => res.json()).then(res => {
                alert('Thank You !')
                this.newsletter = ''
            })
        },

        setCurrentTab(tab) {
            this.currentTab = tab
            this.currentList = this.profile.media[this.currentTab];
            // console.log(currentTab)
            // console.log(this.currentList)
        },

        encode(x) {
            return encodeURIComponent(x)
        },
        getAllMedia() {
            var arr = []
            var res = this.profile
            for (let i = 0; i < res.tabs.length; i++) {
                // console.log(res.products[res.tabs[i]])
                arr.push(res.media[res.tabs[i]][0])
                // arr.push(res.products[res.tabs[i]][1])

            }
            this.currentList = arr
        },
    },

    mounted() {

        this.spinner = true

        fetch(this.api).then(res => res.json()).then(res => {
            console.log(res)
            this.profile = res
            this.xprofile = res
            // this.initTranslation()
            this.spinner = false
            this.getAllMedia()
            this.sub = this.api + '?subscribe=1'
            this.initTarjama(res)
            console.log(JSON.parse(res.blogs[0].blogContent))
            document.getElementById('blog-1').innerHTML = JSON.parse(res.blogs[0].blogContent)


        })

        // console.log(this.currentList)
    }
})


app.component('card', {
    template:
        /*html*/
        `
        <!-- P O T  -->
        <div class="card-pot my-3" :style="'width: '+width+'px;'">

            <div class="shadow-sm bg-light rounded scale-in-center">
                <!-- customized ratio control -->
                <img :src="url" :alt="imgAlt" class="img-fluid rounded-top">
                <div class="card-body d-flex justify-content-between align-items-center p-3">
                    <h5 class="lh-base ">{{title}}</h5>
                    <i class="bi bi-three-dots-vertical fs-4 point" data-bs-toggle="modal"
                        :data-bs-target="'#'+id" style="color:#8d99ae;"></i>
                </div>
            </div>
            <!-- Modal -->
            <div class="modal fade" :id="id" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <img :src="url" class="img-fluid rounded me-3" style="width:50px;height:50px;">
                            <h5 class="modal-title">{{title}}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close">
                            </button>
                        </div>
                        <div class="modal-body">
                            {{info}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['url', 'title', 'info', 'imgAlt', 'width', 'id'],
})

app.component('blog', {
    template:
        /*html*/
        `
    
            <div class="w-300 w-sm-100 m-2 shadow rounded d-flex flex-column">
            <img :src="img" alt="title" class="mb-2 img-fluid rounded-top" width="300" height="300">
            <div class="px-3 w-100">
                <div class="text-secondary fs-small d-flex justify-content-between">
                    <span class="d-flex align-items-center arb"><i class="bi bi-person-circle me-2 fs-6"></i>
                     {{tarjem(author,lang)}} 
                    </span>
                    <span class="d-flex align-items-center arb"><i class="bi bi-clock me-2 fs-6"></i> 
                    {{blogDate(date)}} 
                    </span>
                </div>
                <!-- <text></text> -->
                <h6 class="fs-5 mt-2 lh-base arb" style="max-height: 60px;min-height: 60px;" :dir="dir">
                   
                {{trancate(tarjem(title,lang),8)}} 
                    <!-- <i class="bi bi-three-dots text-primary ms-1"></i> -->
                </h6>
                <!-- <hr> -->
                <div class="d-flex justify-content-start align-items-center gap-2">
                    <h6 v-for="t in tags"
                        class="fs-smaller bg-light shadow-sm ls-1 rounded-pill p-2 px-3 text-dark point"><Span
                            class="me-1 text-primary">#</Span>
                             {{t}}
                    </h6>
                </div>
                <button class="w-100 mb-3 mt-2 px-4 btn btn-outline-primary" data-bs-toggle="modal"
                    :data-bs-target="'#'+index" @click="loadBlog"> {{tarjem('Read more ;; اقرأ المزيد',lang)}}
                </button>
            </div>

            <!-- Modal -->
            <div class="modal fade" :id="index" tabindex="-1">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">

                            <div class="text-secondary d-flex justify-content-between flex-column">
                                <span class="fs-5"><i class="bi bi-quote me-2"></i>
                             
                                {{trancate(tarjem(title,lang),8)}} 
                                </span>

                            </div>
                            <!-- <h5 class="modal-title fs-5" id="exampleModalLabel">Lorem ipsum dolor sit amet consectetur.</h5> -->
                            <i class="bi bi-arrow-right point fs-5 text-secondary ms-1" data-bs-dismiss="modal"></i>
                            <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                        </div>
                        <article class="modal-body">

                            <section class="d-flex gap-4  flow-x w-100">
                              
                            <img v-for="i in images" :src="i.url" class="w-100 h-100 rounded shadow" >
                              
                            </section>
                          
                            <!-- Content -->
                            <section :id="'C'+index" class="text-decore">
                            
                            </section>

                            <div class="d-flex justify-content-start align-items-center gap-2">
                                <h6 v-for="t in tags"
                                    class="fs-smaller bg-light shadow-sm ls-1 rounded-pill p-2 px-3 text-dark point"><Span
                                        class="me-1 text-primary">#</Span>
                                        {{t}}
                                </h6>
                            </div>

                            <span class="text-secondary com fs-xsmall px-1"> <i class="bi bi-clock me-1"></i>
                                {{blogDate(date)}} 
                            </span>

                        </article>
                    </div>
                </div>
            </div>
        </div>

    
    `,
    methods: {
        blogDate(d) {
            return d.slice(0, d.indexOf('T'))
        },
        trancate(text, size) {
            // it trancate n number of words
            // var n = 20
            // var text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non neque nesciunt et. Exercitationem quam corrupti officia expedita aspernatur eveniet fugiat repudiandae quos? Harum omnis molestias eos quia, in illum incidunt exercitationem, enim possimus quasi laboriosam ut! Alias provident consequatur dicta.'
            // console.log(text.split(' ',20))
            if (text.split(' ').length < size) return text
            else {

                var words = text.split(' ', size)
                var trancatedText = ''
                words.forEach(word => {
                    trancatedText += word + ' '
                })
                trancatedText += ' ...'
                // console.log(trancatedText)
                return trancatedText
            }
        },

        isArabic(text) {
            var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
            result = pattern.test(text);
            return result;
        },
        isEng(text) {

            var pattern = /[A-z]/gi;
            result = pattern.test(text);
            return result;
        },
        isRus(text) {

            var pattern = /[\u0400-\u04FF]/gi;
            result = pattern.test(text);
            return result;
        },
        tarjem(text, lang) {

            var res;
            // var lang = 'arb'
            // console.log('tarjem')
            // var text = `привет e ;; hello world ;; e السلام عليكم `
            if (lang == 'arb') {
                var demo = text.split(';;')
                demo.forEach(e => {
                    if (this.isArabic(e)) res = e
                })
            } else {
                if (lang == 'eng') {

                    var demo = text.split(';;')
                    demo.forEach(e => {
                        if (this.isEng(e)) res = e
                    })
                } else {
                    if (lang == 'rus') {

                        var demo = text.split(';;')
                        demo.forEach(e => {
                            if (this.isRus(e)) res = e
                        })
                    }
                }
            }
            return res
        },
        loadBlog() {

            document.getElementById('C' + this.index).innerHTML = this.dotmark()
        },
        dotmark() {
            //will return a string into html
            var parentTagName = 'article'
            lines = this.tarjem(this.content, this.lang)

            lines = lines.split('\n')
            var childTag = 'p'
            var childClass = 'text-start'
            var parentTag = document.createElement(parentTagName)

            lines.forEach(line => {

                if (line == '') {
                    parentTag.appendChild(document.createElement('br'))
                    return

                }

                if (line.includes('*')) {

                    if (line.includes('.......')) { childTag = 'h6'; line = line.replace('.......', '') }
                    if (line.includes('......')) { childTag = 'h5'; line = line.replace('......', '') }
                    if (line.includes('.....')) { childTag = 'h4'; line = line.replace('.....', '') }
                    if (line.includes('....')) { childTag = 'h3'; line = line.replace('....', '') }
                    if (line.includes('...')) { childTag = 'h2'; line = line.replace('...', '') }
                    if (line.includes('..')) { childTag = 'h1'; line = line.replace('..', '') }

                    line = line.replace('*', '')


                    var child = document.createElement(childTag)
                    var ul = document.createElement('ul')
                    var li = document.createElement('li')


                    if (line.includes('!!!')) { childClass = 'text-end'; line = line.replace('!!!', '') }
                    if (line.includes('!!')) { childClass = 'text-center'; line = line.replace('!!', '') }


                    // matching link
                    line = line.replace(/(?<name>[^\s]+)::(?<url>[^\s]+)/gm, '<a href="$2" >$1</a>')

                    // MATCHING HR LINE
                    line = line.replace(/__/, '<hr>')

                    // MATCHING DASH SPACE
                    line = line.replace(/---/gm, '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp')
                    line = line.replace(/--/gm, '&nbsp&nbsp')

                    child.classList.add(childClass)
                    // child.append(line)
                    child.innerHTML = line

                    li.append(child)
                    ul.append(li)

                    parentTag.append(ul)
                    childClass = 'text-start'
                    childTag = 'p'
                    return
                }

                if (line.includes('.......')) { childTag = 'h6'; line = line.replace('.......', '') }
                if (line.includes('......')) { childTag = 'h5'; line = line.replace('......', '') }
                if (line.includes('.....')) { childTag = 'h4'; line = line.replace('.....', '') }
                if (line.includes('....')) { childTag = 'h3'; line = line.replace('....', '') }
                if (line.includes('...')) { childTag = 'h2'; line = line.replace('...', '') }
                if (line.includes('..')) { childTag = 'h1'; line = line.replace('..', '') }

                var child = document.createElement(childTag)

                if (line.includes('!!!')) { childClass = 'text-end'; line = line.replace('!!!', '') }
                if (line.includes('!!')) { childClass = 'text-center'; line = line.replace('!!', '') }

                // MATCHING SINGLE LINK
                line = line.replace(/(?<name>[^\s]+)::(?<url>[^\s]+)/gm, '<a href="$2" >$1</a>')

                // MATCHING HR LINE
                line = line.replace(/__/, '<hr>')

                // MATCHING DASH SPACE
                line = line.replace(/---/gm, '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp')
                line = line.replace(/--/gm, '&nbsp&nbsp')

                child.classList.add(childClass)
                // child.append(line)
                child.innerHTML = line
                parentTag.append(child)
                childClass = 'text-left'
                childTag = 'p'


            });
            console.log(`<article>${parentTag.innerHTML}</article>`)
            // document.getElementById('screen').append(parentTag)
            // return parentTag
            return `<article>${parentTag.innerHTML}</article>`
        },

    },
    mounted() {

        document.getElementById('C' + this.index).innerHTML = this.tarjem(this.content, this.lang)
    },
    props: ['author', 'images', 'content', 'date', 'title', 'index', 'tags', 'img', 'counter', 'lang']
})

app.component('team', {
    template:
        /*html*/
        `
        <div class="team shadow bg-light rounded scale-in-center my-3" style="width: 250px">
            <!-- customized ratio control -->
            <img :src="url" alt="imgAlt" class="img-fluid rounded-top">
            <div class="p-3">
                <h6 class="lh-base text-center"> {{name}} - <span class="text-secondary">{{position}}</span> </h6>
            </div>
        </div>
        
    `,
    props: ['url', 'name', 'position', 'imgAlt', 'width', 'id'],
})

app.component('faq', {
    template:
        /*html*/
        `

    <div class="faq container d-flex align-items-center p-3 rounded shadow-sm bg-light my-3 point" data-bs-toggle="modal" :data-bs-target="'#'+index">
        <i class="bi bi-chat-square-text fs-4 me-3 text-primary"></i>
        <strong class="fs-6"> {{question}} </strong>

        <i class="bi bi-arrows-angle-expand ms-auto fs-5 point text-secondary point" data-bs-toggle="modal"
            :data-bs-target="'#'+index"></i>


        <!-- Modal -->
        <div class="modal fade" :id="index" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">

                        <i class="bi bi-chat-square-text fs-4 text-primary"></i>
                        <h5 class="modal-title fs-6 mx-auto">{{question}}</h5>
                        <i class="bi bi-arrow-return-right fs-4 point" data-bs-dismiss="modal" aria-label="Close"></i>
                    </div>
                    <div class="modal-body">
                        <slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    props: ['question', 'index']
})

app.component('swiper', {
    template:
        /*html*/
        `
    <!-- Swiper -->
    <div class="swiper">
        <div class="swiper-wrapper">
            <div v-for="l in list" class="swiper-slide " :style="'width:'+w+'; height:'+h+';'">
                <img :src="l.url" class="img-fluid rounded" alt="l.name">
            </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination spot-white"></div>
    </div>
    `,
    props: ['list', 'w', 'h']
})













app.mount('#app')