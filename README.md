# Travelling Salesman Problem
This is a playground to deal with the tsp in javascript. There are currently two methods implemented.

Check out the -> [demo](http://moritzgoeckel.com/TravellingSalesman/) <-

## Nearest Neighbour
It starts with the starting point for the path and chooses always the nearest point to the last point as the next point. In the end it will return to the starting point. This method is fast, but not a perfect solution.

## Genetic Algorithm
This algorithm will generate random paths with a given starting / end point in the beginning. These paths are the first generation. Only the best n paths "survive" and generate slightly randomly mutated offspring. The resulting paths (parents + offspring) are again selected and only the best n paths survive. These paths are the new generation. This process is repeated until somone stops the algorithm. This generates pretty good results while using a lot of efford in calculations.

## Minimum Point to Path distance / Insertion
-> todo

# How to use
Load the index.html and click on the top map to add waypoints. The first waypoint is red and represents the starting / end point. All other waypoints are blue. The maps bellow are the different methods with the graphical representation of the path.

# Coding Challenge
This project was created as a submition for a coding challenge of IT-Talents.de