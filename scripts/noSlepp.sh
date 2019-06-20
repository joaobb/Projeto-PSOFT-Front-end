#!/bin/bash

front="https://psoftjoseteste.herokuapp.com/index.html"
back="https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects?substring=nosleep"
cont=0

while true; do
    sleep 1740
        curl -s -S $front > /dev/null
	curl -s -S $back > /dev/null
	x=$((x+1))
	echo "Accessed times:" $x
done
