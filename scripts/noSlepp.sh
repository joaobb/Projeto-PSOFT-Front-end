#!/bin/bash

front="https://psoftjoseteste.herokuapp.com/index.html"
back="https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects?substring=nosleep"
cont=0

while true; do
    echo "Accessed times:" $cont
    echo "Time:" $(date +"%H:%M:%S")

    sleep 600 #Will curl both services every 10 minutes
        curl -s -S $front > /dev/null
	curl -s -S $back > /dev/null
	cont=$((cont + 1))

done
