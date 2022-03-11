import sys

print("hello Python \n ")
print(" args[0] = ",sys.argv[1])

with open('python/simple_copy.txt') as data:
    for item in data:
        print(item)
