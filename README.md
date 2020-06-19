# VulnTestlab
Simple BlogSite loaded with fun exploits

The Project aims to demonstrate some of the more rare exploits in Web Application world, and is strictly NOT for production use. Or please do use it, and let me know your IP Address.However, I do not take any responsibilty for the consequences of deployment.

## Exploits coded-in:
* Server-Side Template Injection
* JSON SWF Cross-site request forgery
* NoSQL Injection
* Node Deserialization Attack

## Requirements:
* Nodejs Framework
* MongoDB

### For Fresh install on Kali-Machines (Instructions may differ on other Linux Distros) :

```
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y npm
sudo apt-get install -y mongodb-org
chown -R mongodb:mongodb /var/lib/mongodb
chown mongodb:mongodb /tmp/mongodb-27017.sock
sudo service mongod start
git clone https://github.com/wisahmed/VulnTestlab.git
cd VulnTestlab
npm start
```
