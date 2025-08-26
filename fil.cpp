// #include <bits/stdc++.h>
// using namespace std;

// class Animal
// {
// public:
//     virtual void sound()
//     {
//         cout << "Animal Sounds.." << endl;
//         return;
//     }
// };

// class Dog : public Animal
// {
// public:
//     void sound() override
//     {
//         cout << "Dog barks.." << endl;
//         return;
//     }
// };

// class Cat : public Animal
// {
// public:
//     void sound() override
//     {
//         cout << "Cat Barras..";
//         return;
//     }
// };

// int main()
// {
//     Animal *a;
//     Dog d;
//     Cat c;
//     a = &d;
//     a->sound();
//     a = &c;
//     a->sound();
//     return 0;
// }

// #include <iostream>
// using namespace std;

// class Base
// {
// public:
//   virtual  void show()
//     {
//         cout << "Base class show()" << endl;
//     }
// };

// class Derived : public Base
// {
// public:
//     void show()
//     {
//         cout << "Derived class show()" << endl;
//     }
// };

// int main()
// {
//     Base *ptr;
//     Derived d;
//     ptr = &d;
//     ptr->show(); // Output: Base class show() ❌ (Expected Derived class show())
//     return 0;
// }

#include <iostream>
using namespace std;

class Animal
{ // Abstract Class
public:
    virtual void sound() = 0; // Pure Virtual Function
};

class Dog : public Animal
{
public:
    void sound() override
    {
        cout << "Dog barks" << endl;
    }
};

int main()
{
    // Animal a; ❌ Error — Cannot instantiate abstract class
    Dog d;
    d.sound(); // ✅ Dog barks
    return 0;
}
