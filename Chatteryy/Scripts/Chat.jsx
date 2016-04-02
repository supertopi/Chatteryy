var Chat = React.createClass({

    getInitialState: function ()
    {
        return {
            chat: null,
            userName: null,
            newMessage: 'Welcome to chat!'
        }
    },

    //Initialize SignalR hub
    componentDidMount: function () 
    {
        var chat = $.connection.chatHub;
        chat.client.broadCastMessage = this.onReceiveMessage;
        this.setState({ chat: chat });
        $.connection.hub.start();
    },

    //Handle the input from ChatInput to server
    onSendMessage: function ( message) {
        // receive from ChatInput child event, forward to SignalR Hub
        this.state.chat.server.send(this.refs.profile.getName(), message);
    },

    //Handle the ChatMessages content from server
    onReceiveMessage: function( message)
    {
        //send to ChatMessages child
        this.setState({newMessage : message});
    },

    render: function () {
        return (<div>
                   <ChatProfile ref='profile' />
                   <ChatMessages newMessage={this.state.newMessage}/>
                   <ChatInput sendMessageCallback={this.onSendMessage }/>
               </div>)
    }
});


var ChatProfile = React.createClass({

    getInitialState: function () {
        return { name: 'Guest' }
    },
    getName: function () {
        return this.state.name;
    },
    handleChange: function (event) {
        this.setState({ name: event.target.value });
    },
    render: function () { return <input type="text" value={this.state.name} onChange={this.handleChange} /> }

});


var ChatMessages = React.createClass({

    getInitialState : function ()
    {
        return { messageHistory: new Array() }
    },

    propTypes: {
        newMessage: React.PropTypes.string,
    },

    componentWillReceiveProps: function (newMsg) {
        //Called when a new message arrives
        var updated = this.state.messageHistory;
        updated.push(newMsg);
        this.setState({ messageHistory: updated });
    },
    render: function () {
        //should we take just the latest messages?
        var msgs = this.state.messageHistory.map(function (msg) {
            return <li> {msg.newMessage} </li>
        });

        return <ul>{msgs}</ul>
    }
});


var ChatInput = React.createClass({

    getInitialState: function (){
        return { value: '' }
    },
    propTypes: {
        sendMessageCallback: React.PropTypes.func,
    },
    handleChange: function (event) {
        this.setState({ value: event.target.value });
    },
    sendMessage: function (e) {
        e.preventDefault();
        this.props.sendMessageCallback(this.state.value);
        this.setState({ value: '' });
    },
    render: function() {
        return (
        <form>
          <input type='text' value={this.state.value} onChange={this.handleChange}/>
          <button onClick={this.sendMessage} >Send</button>
         </form>);
    }
});