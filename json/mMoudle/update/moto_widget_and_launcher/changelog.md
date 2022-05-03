# taoaoooo.github.io
NUM=29
(API=32
if [  "$API" -lt $NUM ]; then
	echo "a"
	abort
elif [ "$API"-gt 32 ]; then

	echo "b"
else
	echo "c"

fi
)
A = $(find -name test.s)

if  [ $A != null ];then
	echo "Y"
else
     echo "N"
fi