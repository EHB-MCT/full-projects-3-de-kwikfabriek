using namespace std;

#include <string>
#include <sstream>
#include <vector>
#include <iterator>

template <typename Out>

void splitEngine(const string &s, char delim, Out result);
vector<string> split(const string &s, char delim);