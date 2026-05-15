s = """いろはにほへと
ちるむるをわか
よたれそつねな
らむうゐのおく
やまけふこえて
あさきゆめみし
ゑいもせすん_
""".split()
for i in range(7):
    s[i] = list(s[i])
print(s)

for i in range(7):
    for j in range(7):
        print(s[i][j])