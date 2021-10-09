import React, { useRef, useReducer, Component } from "react";
import { Box, Grid, Text, Layer, Button } from "grommet";
// import DescriptionAndQuestions from "../Components/Streaming/DescriptionAndQuestions";
// import ChatBox from "../Components/Streaming/ChatBox";
import ChannelIdCard from "../Components/Channel/ChannelIdCard";
import Tag from "../Components/Core/Tag";
import Loading from "../Components/Core/Loading";
import { View } from "grommet-icons";
import { Video, VideoService } from "../Services/VideoService";
// import VideoPlayer from "../Components/Streaming/VideoPlayer";

interface Props {
  location: { pathname: string; state: { video: Video } };
}

interface User {
  id: string,
  x: number,
  y: number,
  image: any
}

interface State {
  x: number,
  y: number,
  step: number,
  radius: number,
  image: any,
  users:User[]
}

export default class AvatarPage extends Component<Props, State> {
  canvasRef = React.createRef<HTMLCanvasElement>()
  ctx:any
  constructor(props: Props) {
    super(props);
    const filters = [
      "none",
      "sepia",
      "invert",
      "grayscale",
      "saturate",
      "blur",
    ];
    this.state = {
      x: 40,
      y: 40,
      step: 10,
      radius: 40,
      image: null,
      users: [{
        id: 'dddf1',
        x: 5,
        y:6,
        image:null
      }]
    };
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }
  componentDidUpdate(){
    if(this.canvasRef.current){
      this.renderCanvas()
    }
  }
  componentWillMount() {

  }
  fitCanvas() {
    let _canvas = this.canvasRef.current!
    // @ts-ignore
    _canvas.width = _canvas.parentNode!.clientWidth
    // @ts-ignore
    _canvas.height = _canvas.parentNode!.clientHeight

    this.ctx = _canvas.getContext('2d')
  }

  drawImage(ctx:any, x:number, y:number, radius:number, image:any, color:string='') {
      const {height, width} = this.canvasRef.current!
      color = color || 'rgba(108, 92, 231, 0.9)'
      ctx.save()

      ctx.lineWidth = 5
      ctx.strokeStyle = color
      ctx.beginPath();
      ctx.arc(x, height - y, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.stroke()
      ctx.clip();

      ctx.drawImage(image, x - radius, height - y - radius, 2*radius, 2*radius);

      ctx.restore()
  }
  renderCanvas() {
    let {x, y, radius} = this.state
    let ctx = this.ctx!
    const {height, width} = this.canvasRef.current!

    ctx.clearRect(0,0,width, height)

    if(this.state.image) {
      this.drawImage(ctx, x, y, radius, this.state.image, 'rgba(0, 184, 148, 0.98)')
    }
    let threshold = 250
    for(let i=0; i<this.state.users.length; i++) {
      let user = this.state.users[i]
      if(user.image) {
        this.drawImage(ctx, user.x, user.y, radius, user.image)
      }
      if(this.manhattan_dist({x, y}, user) < threshold) {
        ctx.beginPath();
        ctx.lineWidth = 6
        ctx.moveTo(x, height - y)
        ctx.lineTo(user.x, height - user.y)
        ctx.stroke()
      }
    }

    
  }
  manhattan_dist(a:any, b:any) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }
  componentDidMount() {
    var img = new Image();
    img.src = '/dummy/img3.jpg'
    img.onload = ()=>{
      this.setState({...this.state, image: img})
    }
    var img1 = new Image();
    img1.src = '/dummy/img1.jpg'
    img1.onload = ()=>{
      this.setState({...this.state, users: [{id: 'd1', x:0, y:0, image: img1}]})
    }
    var img2 = new Image();
    img2.src = '/dummy/img2.jpeg'
    img2.onload = ()=>{
      this.setState({...this.state, users: [...this.state.users, {id: 'd2', x:100, y:0, image: img2}]})
    }

    this.fitCanvas()
    this.renderCanvas()
    setInterval(()=>{
      let users = this.state.users.map((u)=> ({...u,  x: u.x+ (Math.random()-0.4)*10, y: u.y + (Math.random() - 0.4)*10}))
      this.setState({...this.state, users: [...users]})
    }, 100)
  }

  onKeyDown(evt:KeyboardEvent){
    // Filter irrelevant key
    if(! ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(evt.code)){
      return
    }
    let dirX = 0
    let dirY = 0
    if(evt.code == 'KeyW') {
      dirY = 1
    }
    if(evt.code == 'KeyS') {
      dirY = -1
    }
    if(evt.code == 'KeyD') {
      dirX = 1
    }
    if(evt.code == 'KeyA') {
      dirX = -1
    }

    let {x, y, radius, step} = this.state
    radius += 2
    x = x + step * dirX
    y = y + step * dirY

    const {height, width} = this.canvasRef.current!
    x = Math.max(0 + radius, Math.min(x, width - radius))
    y = Math.max(0 + radius, Math.min(y, height - radius))
    this.setState({...this.state, x, y})
  }

  render() {
    return (
      <Box align="center">
          
        <Grid
          margin={{ top: "xlarge", bottom: "none" }}
          // rows={["streamViewRow1", "medium"]}
          rows={["streamViewRow1"]}
          columns={["streamViewColumn1", "streamViewColumn2"]}
          gap="medium"
          areas={[
            { name: "player", start: [0, 0], end: [0, 0] },
            { name: "chat", start: [1, 0], end: [1, 0] },
            // { name: "questions", start: [0, 1], end: [1, 1] },
          ]}
        >
          <canvas ref={this.canvasRef}></canvas> 
        </Grid>
      </Box>
    );
  }
}
