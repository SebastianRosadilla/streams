function Factory ($q) {
  'ngInject';

  function Streams() {
    /**
     * Dicctionary that contain all posibles
     * media objects navigation according
     * the corresponding browser
     */
    this.MEDIA_NAVIGATORS = [
      'getUserMedia',
      'webkitGetUserMedia',
      'mozGetUserMedia',
      'msGetUserMedia'
    ];

    this.streamVideo;
    this.streamAudio;
    this.stream;

    // navigator available
    this.mediaNavigator = (() => {
      let index = 0;

      while (index < this.MEDIA_NAVIGATORS.length
            && !navigator[this.MEDIA_NAVIGATORS[index]]) {
        index++;
      }

      if (index > this.MEDIA_NAVIGATORS.length) {
        throw new Error('This navigator not support HTML5');
      }

      return this.MEDIA_NAVIGATORS[index];
    })();

    /**
     * @desc return a audio stream.
     *
     * @return audio stream.
     *
     * @author Alfredo Sebastian Rosadilla Ribeiro.
     */
    this.obtainAudio = () => {
      let deferred = $q.defer();

      if (!this.streamAudio) {
        // match browser with corresponding navigator object
        navigator.getMedia = navigator[this.mediaNavigator];

        navigator.getMedia({
          audio: true
        }, (stream) => {
          this.streamAudio = stream;
          deferred.resolve(stream);
        }, (error) => {
          deferred.reject(error);
        });
      } else {
        deferred.resolve(this.streamAudio);
      }

      return deferred.promise;
    }

    /**
     * @desc return a video stream.
     *
     * @return video stream.
     *
     * @author Alfredo Sebastian Rosadilla Ribeiro.
     */
    this.obtainVideo = () => {
      let deferred = $q.defer();

      if (!this.streamVideo) {
        // match browser with corresponding navigator object
        navigator.getMedia = navigator[this.mediaNavigator];

        navigator.getMedia({
          video: true
        }, (stream) => {
          this.streamVideo = stream;
          deferred.resolve(stream);
        }, (error) => {
          deferred.reject(error);
        });
      } else {
        deferred.resolve(this.streamVideo);
      }

      return deferred.promise;
    }

    /**
     * @desc return a audio and video stream.
     *
     * @return audio and vide stream.
     *
     * @author Alfredo Sebastian Rosadilla Ribeiro.
     */
    this.obtainMedia = () => {
      let deferred = $q.defer();

      if (!this.stream) {
        // match browser with corresponding navigator object
        navigator.getMedia = navigator[this.mediaNavigator];

        navigator.getMedia({
          audio: true,
          video: true
        }, (stream) => {
          this.stream = stream;
          deferred.resolve(stream);
        }, (error) => {
          deferred.reject(error);
        });
      } else {
        deferred.resolve(this.stream);
      }

      return deferred.promise;
    }
  }

  return new Streams();
}

export default {
  name: 'Streams',
  fn: Factory
}
