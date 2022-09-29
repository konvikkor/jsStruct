#include <node.h>
#include <v8.h>
#include <limits.h>
#include <stdint.h>

typedef signed char        my_int8_t;
typedef short              my_int16_t;
typedef int                my_int32_t;
typedef long long          my_int64_t;
typedef unsigned char      my_uint8_t;
typedef unsigned short     my_uint16_t;
typedef unsigned int       my_uint32_t;
typedef unsigned long long my_uint64_t;

struct testStruct
{
    /* data */
    int testField;
    unsigned char * pfield;
} testStruct, *ptestStruct;


//CHAR_BIT