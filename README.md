# project-1-browser-game
In-browser game utilizing HTML/CSS/JavaScript.

# Roadhouse
## Description
You're in the 1989 thriller movie, "Road House". You are a bouncer with a particular set of skills, mainly having the ability to roadhouse kick any object as far as you like. It also doesn't hurt that you're Patrick Swayze.

It's a typical evening at the bar and a disgruntled local has once again drank far too many Busch Lites. It's time for you to subdue the threat. Unfortunately, he is far too large to engage in hand-to-hand combat, so you must roadhouse kick objects at your disposal sitting in the bar. Get too close to the belligerent customer and he may wreck your pretty face. Be sure to align Patrick correctly in order to kick the projectiles in the correct direction!

#### [Wireframe](/Wireframe.png)

## Basic Requirements (MVP)
#### 1. Create a Player and an Enemy class to be instantiated.
- When the game starts, a Player and Enemy should be instantiated and displayed on the screen.
- The Player and Enemy should have health attributes.
#### 2. Set up a cartesian grid system for placement of objects and characters.
- For ease of movement and calculation when navigating characters and identifying collisions.
#### 3. Allow the Player object receive user input to navigate in 4 directions.
- Utilize WASD or arrow keys for navigation.
#### 4. Allow the Enemy to randomly move around the environment with your time interval of choice.
- The Enemy should only be able to move one "unit" at a time within the "grid".
#### 5. Randomly place "chairs" in the bar as objects to kick toward the Enemy (at least 3).
#### 6. When an object is kicked with correct alignment, destroy the Enemy and end the game.
- The object is intended to fly toward the Enemy and defeat them.
#### 7. If the Player character "touches" the Enemy, kill/harm the Player.
#### 8. Player loses if all chairs are kicked and miss.


## Advanced Requirements
#### 1. Allow the Enemy to have randomly generated characteristics.
 - Speed/Health/Sprites.
#### 2. Add a "chair stack" that randomly restocks the bar with chairs/objects.
#### 3. Make the Enemy slowly converge on the Player's position over time.
#### 4. Put "innocent bystanders" in the bar that you cannot hurt.
#### 5. Give chairs/objects different attributes upon kicking.
 - Damage dealt to Enemy upon colision.
 - Distance object can travel (due to weight?).
