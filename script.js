"Use sctrict"

const App = {
    data() {
        return {
            selectValue: [],
            selected1: 'btc',
            selected2: 'eth',
            leftInput: "",
            RightInput: "",
            isActive: false,
        }
    },
    methods: {
        //Получаем минимальную сумму для обмена
        async selectOption() {
            let onecheck = this.selected1
            let twocheck = this.selected2
            let urlPairChech = `https://api.changenow.io/v1/min-amount/${onecheck}_${twocheck}?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd`
            let minimumExchange = await request(urlPairChech)
            if (minimumExchange) {
                this.leftInput = minimumExchange.minAmount
            }
        },
        //Получаем сумму обмена
        async leftInputChangeHandler(event) {
            let onecheck = this.selected1
            let twocheck = this.selected2
            leftInputValue = event.target.value
            if (leftInputValue>=this.leftInput) {
                let urlEstimated = `https://api.changenow.io/v1/exchange-amount/${leftInputValue}/${onecheck}_${twocheck}/?api_key=c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd`
                let estimated = await request(urlEstimated)
                this.leftInput = leftInputValue
                if (estimated) {
                    this.RightInput = estimated.estimatedAmount * leftInputValue
                } else {
                    console.log("Error")
                }
            } else {
                this.RightInput = "–"
            }
        },
        myFilter() {
            this.isActive = !this.isActive;
        },
    },
    //Получаем список валют 'List of available currencies' method;
    async mounted() {
        let valute = await request("https://api.changenow.io/v1/currencies?active=true&fixedRate=true")
        let tickers = []
        for (let i=0; i<valute.length; i++) {
            tickers.push(valute[i])
        }            
        this.selectValue = tickers
    }
}


async function request(url, method="GET", data=null) {
    try {
        const headers = {}
        let body
        if (data) {
            headers["Content-Type"] = "application/json"
            body = JSON.stringify(data)
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        })
        return await response.json()
    } catch (e) {
        console.warn("Error", e.message)
    }
}
Vue.createApp(App).mount("#app")
