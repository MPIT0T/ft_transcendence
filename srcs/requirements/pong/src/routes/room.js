// En JavaScript, on crée une classe avec le mot-clé 'class'.
// Exemple de classe simple :

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Bonjour, je m'appelle ${this.name} et j'ai ${this.age} ans.`);
    }
}

// Utilisation :
const alice = new Person('Alice', 30);
alice.greet(); // Affiche : Bonjour, je m'appelle Alice et j'ai 30 ans.