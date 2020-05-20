import logging
import requests


API_PORT = "5080"
API_APP = "WebRTCAppEE"
LOG_FOLDER_PATH = "/home/cloud-user/log"

class AntMediaRestApi(object):
    """
    Wrapping API methods to locally interact with Ant Media server.
    e.g. http://agora.stream:5080/WebRTCAppEE/rest/broadcast/get?id=1
    """
    def __init__(self):
        self.api_port = API_PORT
        self.api_app = API_APP
        self.api_version = "v2"
        self.basepoint = f"http://agora.stream:{self.api_port}/{self.api_app}/rest/{self.api_version}/"
        self.log_folder_path = LOG_FOLDER_PATH

    ##############
    # BROADCASTS #
    ##############
    def get_total_number_active_live_streams(self):
        raise NotImplementedError()

    def create_conference_room(self, room_id, start_date_of_room=0, end_date_of_room=0):
        """Creates a conference room. By default, duration is 1 hour!

        Args:
            room_id (int): id of the room
            start_date_of_room (int, optional): utc time in s of start time. Defaults to 0.
            end_date_of_room (int, optional): utc time in s of end time. Defaults to 0.

        Returns:
            response (dict): response of the server
        """
        endpoint = "broadcasts/conference-rooms"
        body = {
                "roomId":room_id,
                "startDate":start_date_of_room,
                "endDate":end_date_of_room
                }

        headers = {'Content-type': 'application/json'}
        response = requests.post(self.basepoint + endpoint, json=body, headers=headers)

        try:
            return response.json()
        except Exception as e:
            logging.error(f"create_conference_room: exception raised: {e}")
            return response.text

    def edit_conference_room(self, room_id):
        raise NotImplementedError()

    def delete_conference_room(self, room_id):        
        raise NotImplementedError()

    def get_total_number_broadcasts(self):
        raise NotImplementedError()

    def create_broadcast(self, id, name, description, max_duration_in_s=10):
        """
        Creates a Broadcast, IP Camera or Stream Source and returns the full 
        broadcast object with rtmp address and other information. 
        The different between Broadcast and IP Camera or Stream Source is that 
        Broadcast is ingested by Ant Media ServerIP Camera or Stream Source is 
        pulled by Ant Media Server.

        Arguments:
            id {[type]} -- [description]
            name {[type]} -- [description]
            description {[type]} -- [description]
        
        Keyword Arguments:
            max_duration_in_s {int} -- [description] (default: {10})
        
        Returns:
            [type] -- [description]
        """

        endpoint = "broadcasts/create"
        body = {
                "streamId": id,
                "status": "created",
                "type": "liveStream",
                "name": name,
                "description": description,
                #"publish": true,
                #"date": 0,
                #"plannedStartDate": 0,
                "duration": max_duration_in_s * 1000,
                # "endPointList": [
                #     {
                #     "type": "string",
                #     "broadcastId": "string",
                #     "streamId": "string",
                #     "rtmpUrl": "string",
                #     "name": "string",
                #     "endpointServiceId": "string",
                #     "serverStreamId": "string"
                #     }
                # ],
                # "publicStream": true,
                # "is360": true,
                # "listenerHookURL": "string",
                # "category": "string",
                # "ipAddr": "string",
                # "username": "string",
                # "password": "string",
                # "quality": "string",
                # "speed": 0,
                # "streamUrl": "string",
                # "originAdress": "string",
                # "mp4Enabled": 0,
                # "expireDurationMS": 0,
                # "rtmpURL": "string",
                # "zombi": true,
                # "pendingPacketSize": 0,
                # "hlsViewerCount": 0,
                # "webRTCViewerCount": 0,
                # "rtmpViewerCount": 0,
                # "startTime": 0,
                # "receivedBytes": 0,
                # "bitrate": 0,
                # "userAgent": "string",
                # "latitude": "string",
                # "longitude": "string",
                # "altitude": "string"
                }
                
        headers = {'Content-type': 'application/json'}

        response = requests.post(self.basepoint + endpoint, json=body, headers=headers)

        try:
            return response.json()
        except Exception as e:
            logging.error(f"create_broadcast: exception raised: {e}")
            return response.text

    def get_broadcasts(self, offset, size, type):
        """
        Returns filtered broadcast list according to type. It's useful for 
        getting IP Camera and Stream Sources from the whole list
        """
        raise NotImplementedError()

    def import_to_stalkers(self):
        raise NotImplementedError()

    def get_broadcast_list_from_db(self, offset, size):
        """
        Gets the broadcast list from database.
        """
        raise NotImplementedError()

    def get_onvif_ip_cameras(self):
        raise NotImplementedError()

    def get_credential_social_endpoints(self, offset, size):
        raise NotImplementedError()

    def check_connection_device_social(self):
        raise NotImplementedError()

    def get_available_social_channels(self, service):
        raise NotImplementedError()

    def get_info_social_channels(self):
        raise NotImplementedError()

    def get_social_channel_endpoints(self):
        raise NotImplementedError()

    def revoke_authorization_social(self):
        raise NotImplementedError()

    def get_auth_params_social_network(self):
        raise NotImplementedError()

    def validate_token(self):
        """
        Perform validation of token for requested stream. If validated, 
        success field is true, not validated success field false
        """
        raise NotImplementedError()

    def get_webrtc_receive_stats(self):
        """
        Get WebRTC Low Level receive stats in general.
        """
        raise NotImplementedError()

    def get_webrtc_send_stats(self):
        """
        Get WebRTC Low Level Send stats in general.
        """
        raise NotImplementedError()
        
    def get_broadcast(self, id):
        """
        Get broadcast object.
        """
        endpoint = f"broadcasts/{id}"
        headers = {'Content-type': 'application/json'}

        response = requests.get(self.basepoint + endpoint, headers=headers).json()

        return response

    def update_broadcast(self, id):
        """
        Updates the Broadcast objects fields if it's not null. The updated 
        fields are as follows: name, description, userName, password, IP 
        address, streamUrl of the broadcast. It also updates the social 
        endpoints.
        """
        raise NotImplementedError()

    def delete_broadcast(self, id):
        """
        Delete broadcast from data store and stop if it's broadcasting.
        """

        endpoint = f"broadcasts/{id}"
        headers = {'Content-type': 'application/json'}
        status = self.get_broadcast(id)['status']

        if status in ['created', 'finished']:
            body = {"type": "liveStream"}
            response = requests.delete(self.basepoint + endpoint, json=body, headers=headers).json()
            return response

        elif status == 'broadcasting':
            raise NotImplementedError

        else:
            raise AssertionError

    def get_broadcast_statistics(self, id):
        """
        Get the broadcast live statistics total RTMP watcher count, total HLS 
        watcher count, total WebRTC watcher count.
        """
        raise NotImplementedError()
        
    def get_detected_objects_count(self):
        raise NotImplementedError()
        
    def get_third_party_rtmp_endpoint(self, id):
        raise NotImplementedError()

    def delete_third_party_rtmp_endpoint(self, id):
        raise NotImplementedError()

    def move_ip_camera(self):
        raise NotImplementedError()

    def set_stream_recording_settings(self, id, recording_status):
        """
        Changes the stream recording status.
        """
        assert(isinstance(recording_status, bool))
        recording_status = "true" if recording_status else "false"
        endpoint = f"broadcasts/{id}/recording/{recording_status}"
        headers = {'Content-type': 'application/json'}

        response = requests.put(self.basepoint + endpoint, headers=headers).json()

        return response
    
    def add_social_endpoint_to_stream(self, endpoint_service_id):
        raise NotImplementedError()

    def get_interaction_endpoint(self, interaction):
        raise NotImplementedError()
        
    def get_live_comment_count(self, endpoint_service_id):
        raise NotImplementedError()

    def get_comments(self):
        """
        Returns live comments from a specific endpoint like Facebook, Youtube, 
        PSCP, etc. It works If interactivity is collected which can be 
        enabled/disabled by properties file.
        """
        raise NotImplementedError()

    def get_live_views(self, endpoint_service_id):
        """
        Return the number of live views in specified video service endpoint. 
        It works If interactivity is collected which can be enabled/disabled by 
        properties file.
        """
        raise NotImplementedError()
    
    def start_streaming(self, id):
        """
        Start external sources (IP Cameras and Stream Sources) again if it is 
        added and stopped before.
        """

        endpoint = f"broadcasts/{id}/start"
        body = {
            "streamId": id,
            "type": "liveStream"
            # "endPointList": [
            #     {
            #     "type": "string",
            #     "broadcastId": "string",
            #     "streamId": "string",
            #     "rtmpUrl": "string",
            #     "name": "string",
            #     "endpointServiceId": "string",
            #     "serverStreamId": "string"
            #     }
            # ],
            # "publicStream": true,
            # "is360": true,
            # "listenerHookURL": "string",
            # "category": "string",
            # "ipAddr": "string",
            # "username": "string",
            # "password": "string",
            # "quality": "string",
            # "speed": 0,
            # "streamUrl": "string",
            # "originAdress": "string",
            # "mp4Enabled": 0,
            # "expireDurationMS": 0,
            # "rtmpURL": "string",
            # "zombi": true,
            # "pendingPacketSize": 0,
            # "hlsViewerCount": 0,
            # "webRTCViewerCount": 0,
            # "rtmpViewerCount": 0,
            # "startTime": 0,
            # "receivedBytes": 0,
            # "bitrate": 0,
            # "userAgent": "string",
            # "latitude": "string",
            # "longitude": "string",
            # "altitude": "string"
        }

        headers = {'Content-type': 'application/json'}
        response = requests.post(self.basepoint + endpoint, json=body, headers=headers).json()

        return response
    
    def stop_streaming(self, id):
        """
        Stop streaming for the active stream. It both stops ingested(RTMP, 
        WebRTC) or pulled stream sources (IP Cameras and Stream Sources).
        """

        endpoint = f"broadcasts/{id}/stop"
        body = {
            "type": "liveStream"
        }
        headers = {'Content-type': 'application/json'}
        response = requests.post(self.basepoint + endpoint, json=body, headers=headers).json()

        return response
    
    def get_ot_token(self, id):
        """
        Generates random one-time token for specified stream.
        """
        raise NotImplementedError()
    
    def remove_all_tokens(self, id):
        """
        Removes all tokens related with requested stream.
        """
        raise NotImplementedError()
    
    def get_all_tokens(self, id, offset, size):
        """
        Get the all tokens of requested stream.
        """
        raise NotImplementedError()
    
    def get_camera_error(self, id_address):
        raise NotImplementedError()
    
    def get_webrtc_client_stats(self, id, offset, size):
        """
        Get WebRTC Client Statistics such as : Audio bitrate, Video bitrate, 
        Target bitrate, Video Sent Period etc.
        """
        raise NotImplementedError()
    
    ################
    # REST Service #
    ################
    def get_version(self):
        raise NotImplementedError()
       
    #####################
    # VODS Rest Service #
    #####################
    def get_number_vod(self):
        raise NotImplementedError()

    def upload_vod_to_ams(self):
        """
        Upload external VoD file to Ant Media Server.
        """
        raise NotImplementedError()

    def import_vod_to_stalker(self):
        raise NotImplementedError()

    def get_vod_list_from_db(self):
        raise NotImplementedError()
        
    def synchronise_vod_folder_to_db(self):
        raise NotImplementedError()
        
    def get_vod_from_db(self):
        """
        Get the VoD list from database.
        """
        raise NotImplementedError()
        
    def delete_vod(self, id):
        """
        Delete specific VoD File.
        """
        raise NotImplementedError()

    
# Testing unit
if __name__ == "__main__":

    # Test
    obj = AntMediaRestApi()
    id = "datasig"
    
    # print(obj.create_conference_room(123))
    # print(obj.create_broadcast(id=id, name="seminar-08-05-20", description="Compactness of rough paths", max_duration_in_s=10))
    # print(obj.set_stream_recording_settings(id=id, recording_status=True))
    # print(obj.start_streaming(id=id))
    # print(obj.get_broadcast(id=id))
    # print(obj.stop_streaming(id=id))
    # print(obj.delete_broadcast(id=id))
