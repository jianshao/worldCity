package config

type Config struct {
	Mysql struct {
		DSN string `yaml:"dsn"`
	} `yaml:"mysql"`
	Redis struct {
		Addr     string `yaml:"addr"`
		Password string `yaml:"password"`
		DB       int    `yaml:"db"`
	} `yaml:"redis"`
	OSS struct {
		Endpoint  string `yaml:"endpoint"`
		AccessKey string `yaml:"access_key"`
		SecretKey string `yaml:"secret_key"`
		Bucket    string `yaml:"bucket"`
		Domain    string `yaml:"domain"`
	} `yaml:"oss"`
	Yunxin struct {
		AppKey    string `yaml:"app_key"`
		AppSecret string `yaml:"app_secret"`
	} `yaml:"yunxin"`
}

var conf Config

func InitConfig() {
	// f, err := os.Open("config/config.yaml")
	// if err != nil {
	// 	log.Fatal("config/config.yaml read error: ", err)
	// }
	// defer f.Close()

	// d := yaml.NewDecoder(f)
	// err = d.Decode(&conf)
	// if err != nil {
	// 	log.Fatal("config.yaml decode error: ", err)
	// }
}

// func GetConf() *Config {
// 	return &conf
// }
