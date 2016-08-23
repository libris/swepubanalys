package traits
/**
 * Created by Theodor on 2016-02-03.
 */
trait ConfigConsumable {
    static currentConfig(){
        def url = this.classLoader.getResource("config.groovy");
        assert url
        def config =  new ConfigSlurper().parse(url)
        return config
    }
}