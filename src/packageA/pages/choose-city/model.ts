import { ChinaCitys } from "@/static/city.constant"

class ChooseCityModel {
    /**
     * 
     */
    static getData() {
        const cities = Object.keys(ChinaCitys).map(code => {
            const city = ChinaCitys[code]
            // city.code = code.substr(1)
            return city
        })
        const list = ChooseCityModel.classify(cities)
        return list
    }
    /**
     * 
     */
    static classify(cities) {
        var letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split('');
        var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫中".split('');
        const list = []
        letters.forEach((letter: string, i: number) => {
            const items = ChooseCityModel.find(zh[i], zh[i+1], cities, letter)
            list.push({
                title: letter,
                key: letter,
                items
            })
        })
        return list
    }
    /**
     * 
     */
    static find(left: string, right: string, cities, key: string) {
        let list = []
        cities.map(city => {
            const mid: string = city.name.substr(0,1)
            if(left.localeCompare(mid)<=0 && mid.localeCompare(right)<0) {
                city.key = key
                list.push(city)
            }
        })
        return list
    }
}

export default ChooseCityModel