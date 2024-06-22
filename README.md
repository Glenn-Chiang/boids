# boids
An implementation of Craig Reynolds' artificial life program that aims to simulate the flocking behaviour of bird-like entities known as “boids”. This simulation is a demonstration of how discrete individual agents each following an independent set of rules can produce an effect of seemingly coordinated group behaviour. 

The behaviour of each boid is governed by only 3 basic rules:

### 1. Separation
    
Steer away from neighbors that are too close to it
    
### 2. Alignment
    
Steer towards the approximate average direction of its neighbors
    
### 3. Cohesion
    
Steer towards the approximate center of mass of its neighbors

While each boid only has a limited awareness of its neighboring boids, the entire flock can move in a surprisingly harmonious and synchronized manner even without any explicit control at the group level.

## Implementation
- Boids are spawned at a random position with a random velocity
- On every frame, each boid updates its velocity according to the 3 rules: separation, alignment and cohesion
- Each of the rules computes a desired velocity for the boid, and the resultant velocity is determined by summing these velocities
- The boid's is moved to its next position on the next frame based on its updated velocity 
- By giving each rule a certain weightage factor and multiplying its desired velocity by this factor, we can control the extent to which each rule influences the resultant velocity of the boid

## Getting started
You can run this program lcoally in your browser.
1. Clone this repository and navigate to its root directory
2. Run the following commands
   ```
   npm install
   npm run dev
   ```
3. Open the webapp in your browser

## Usage
- Click on the canvas to spawn boids
- Toggle the sliders to adjust the simulation parameters
- Experiment and observe how the parameters influence the behaviour of the boids
