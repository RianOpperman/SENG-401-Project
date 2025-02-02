Import the images to your docker workspace
using docker load -i (image path)

Then run the image with this command:

`docker run -it -p (local port):8000 --name (container name) (image name)`

Here are a list of port numbers and their respective container/service:
| Port \# | Container/Service|
| 8000 | Movie Service |
| 8001 | Cast & Crew Service |
| 8002 | Series Service |
| 8003 | User Service |
| 8004 | Comment Service |

The container name can be whatever you want basically,
but for your own sake try to give it a name that makes sense.

The image name should be imported when you are loading the image  

To stop the container in it's interactive mode use `CTRL-C`

After the container is run once, you can start it like so

`docker start (container name)`

Can stop it like so

`docker stop (container name)`
