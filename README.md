
Introduction
====================
*Draw!* is a personal project on mine while trying to learn server.io. I initially started with p5, creating a rudamentary canvas with client communication on my local server. However, because I wanted to grow my project into a game, I decided to use the javascript canvas instead. Over the course of two weeks, I developed buttons for drawing tools, a chat messenger, and a pictionary game (with game timer, random words, and score keeping).

## Canvas
I have had experience with working with the canvas and mouse position tracking. Drawing is done with two functions. The mousedown function creates a circle with radius equal to half of the width. The mousemove function keeps track of the previous mousemove position and the current, connecting the two with a line. 

At first, I decided to use a static canvas size, but that proved unwieldy as I added more features such as chat and tools. I reformated everything so that the canvas would always take up 66% of the screen width using Bootstrap's convenient grid. However, by doing so, I encountered two problems. When sending information to the server and back to the other clients, the dimensions would be off, creating an altered image. Secondly, resizing the screen would also cause similar mouse position problems. These two problems were fixed using a percentage for mouse position relative to the upper left corner. Resizes were fixed with a detector on window resize. Then, the current canvas image is saved onto a hidden canvas. That image is then transfered to the original resized canvas.

## Colors
My initial design for color selection is very similar to Google's. It has a slider and a rectangle that you can select from. While creating the slider, I mapped colors from red to red again to a linear array that ranged from 0 to 179. Then I had a slider that could change values from 0 to 179 and associated each value with a color. The more difficult part was determining how Google created its rectangle. I discovered that the very left side had colors that equal red, blue and green values while the right side had values ranging from the original color to black (which changed linearly). Using this knowledge, I created rows of pixels that had linearly changing red, blue and green values. Then, I drew each individual pixel on the canvas using that particular color. 

I stored these pixels into a double array. By keeping track of the mouse position, I was able to determine the color where my mouse cursor was. I then drew a circle 10 pixels wide around the color and reset the entire rectangle when I mouse dragged or mouse downed. However, this made it so that it had to render every pixel on the rectangle again. Instead, I decided to cut out a 15 by 15 rectangle around the circle and only redraw those pixels, which allowed for no lag and easier selection of colors.

## Socket.io
This is my first time using socket.io. The commands were relatively simple: I mainly used emit, broadcast, and and on. The initial server for listening to Draw! was very simple, making everything client side for easy access. However, I ran into problems when starting the create the game. Suddenly, I needed to keep track of who sent what message in order to give points and reveal the word if correct. I transferred most of the messages server side, with the server dealing with broadcasting messages to all sockets and the point system if a participant guessed the word. 

## Message Box
The message box is composed of an uneditable text area and another text area that's editable. When enter is pressed, the text is reset and the message is sent to the server and back to all the sockets' message box.

## Game
After everything was set up, I created the pictionary game. Players are selected randomly from the server to start and each player has four turns. When someone besides the person drawing guesses the word, the word is revealed to them along with a message in the message box. Words are selected from a list of 300 words ranging from easy to hard difficulty.

## Conclusion
In conclusion, Draw! was created using a mixuture of javascript canvas, socket.io, and nodeJs. It takes lots of elements from a drawing white board and pairs it with the commonly known game, pictionary. Because it needs a server to be hosted, I used Amazon EC2. 
