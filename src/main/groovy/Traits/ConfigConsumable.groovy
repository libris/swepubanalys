package traits
/**
 * Created by Theodor on 2016-02-03.
 */
trait ConfigConsumable {
    static currentConfig(){
        URL url = this.getClassLoader().getResource("config.groovy");
        def config =  new ConfigSlurper().parse(url)
        return config
    }
}