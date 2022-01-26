#include <functions.h>

template <typename Out>

void splitEngine(const string &s, char delim, Out result) {
    istringstream iss(s);
    string item;
    while (getline(iss, item, delim)) {
        *result++ = item;
    }
}

vector<string> split(const string &s, char delim) {
    vector<string> elems;
    splitEngine(s, delim, back_inserter(elems));
    return elems;
}