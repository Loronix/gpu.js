const {
	utils
} = require('../../utils');
const {
	kernelRunShortcut
} = require('../../kernel-run-shortcut');

function removeFnNoise(fn) {
	if (/^function /.test(fn)) {
		fn = fn.substring(9);
	}
	return fn.replace(/[_]typeof/g, 'typeof');
}

function removeNoise(str) {
	return str
		.replace(/^[A-Za-z23]+/, 'function')
		.replace(/[_]typeof/g, 'typeof');
}

function boolToString(value) {
	if (value) {
		return 'true';
	} else if (value === false) {
		return 'false';
	}
	return 'null';
}

function webGLKernelString(gpuKernel, name) {
	return `() => {
    ${ kernelRunShortcut.toString() };
    const utils = {
      allPropertiesOf: ${ removeNoise(utils.allPropertiesOf.toString()) },
      clone: ${ removeNoise(utils.clone.toString()) },
      splitArray: ${ removeNoise(utils.splitArray.toString()) },
      getVariableType: ${ removeNoise(utils.getVariableType.toString()) },
      getDimensions: ${ removeNoise(utils.getDimensions.toString()) },
      dimToTexSize: ${ removeNoise(utils.dimToTexSize.toString()) },
      flattenTo: ${ removeNoise(utils.flattenTo.toString()) },
      flatten2dArrayTo: ${ removeNoise(utils.flatten2dArrayTo.toString()) },
      flatten3dArrayTo: ${ removeNoise(utils.flatten3dArrayTo.toString()) },
      systemEndianness: ${ removeNoise(utils.getSystemEndianness.toString()) },
      isArray: ${ removeNoise(utils.isArray.toString()) }
    };
    const canvases = [];
    const maxTexSizes = {};
    let Texture = function() {};
    let Input = function() {}; 
    class ${ name || 'Kernel' } {
      constructor() {
        this.maxTexSize = null;
        this.argumentsLength = 0;
        this.constantsLength = 0;
        this.canvas = null;
        this.context = null;
        this.program = null;
        this.subKernels = null;
        this.subKernelNames = null;
        this.wraparound = null;
        this.drawBuffersMap = ${ gpuKernel.drawBuffersMap ? JSON.stringify(gpuKernel.drawBuffersMap) : 'null' };
        this.endianness = '${ gpuKernel.endianness }';
        this.graphical = ${ boolToString(gpuKernel.graphical) };
        this.floatTextures = ${ boolToString(gpuKernel.floatTextures) };
        this.floatOutput = ${ boolToString(gpuKernel.floatOutput) };
        this.floatOutputForce = ${ boolToString(gpuKernel.floatOutputForce) };
        this.hardcodeConstants = ${ boolToString(gpuKernel.hardcodeConstants) };
        this.pipeline = ${ boolToString(gpuKernel.pipeline) };
        this.argumentNames = ${ JSON.stringify(gpuKernel.argumentNames) };
        this.argumentTypes = ${ JSON.stringify(gpuKernel.argumentTypes) };
        this.texSize = ${ JSON.stringify(gpuKernel.texSize) };
        this.output = ${ JSON.stringify(gpuKernel.output) };
        this.compiledFragmentShader = \`${ gpuKernel.compiledFragmentShader }\`;
		    this.compiledVertexShader = \`${ gpuKernel.compiledVertexShader }\`;
		    this.programUniformLocationCache = {};
		    this.textureCache = {};
		    this.subKernelOutputTextures = null;
		    this.extensions = {};
		    this.uniform1fCache = {};
		    this.uniform1iCache = {};
		    this.uniform2fCache = {};
		    this.uniform2fvCache = {};
		    this.uniform2ivCache = {};
		    this.uniform3fvCache = {};
		    this.uniform3ivCache = {};
      }
      getFragmentShader() { return this.compiledFragmentShader; }
      getVertexShader() { return this.compiledVertexShader; }
      validateSettings() {}
      initExtensions() {}
      setupArguments() {}
      setupConstants() {}
      setCanvas(canvas) { this.canvas = canvas; return this; }
      setContext(context) { this.context = context; return this; }
      setTexture(Type) { Texture = Type; }
      setInput(Type) { Input = Type; }
      ${ removeFnNoise(gpuKernel.getUniformLocation.toString()) }
      ${ removeFnNoise(gpuKernel.build.toString()) }
		  ${ removeFnNoise(gpuKernel.run.toString()) }
		  ${ removeFnNoise(gpuKernel._addArgument.toString()) }
		  ${ removeFnNoise(gpuKernel.formatArrayTransfer.toString()) }
		  ${ removeFnNoise(gpuKernel.checkOutput.toString()) }
		  ${ removeFnNoise(gpuKernel.getArgumentTexture.toString()) }
		  ${ removeFnNoise(gpuKernel.getTextureCache.toString()) }
		  ${ removeFnNoise(gpuKernel.getOutputTexture.toString()) }
		  ${ removeFnNoise(gpuKernel.renderOutput.toString()) }
		  ${ removeFnNoise(gpuKernel.updateMaxTexSize.toString()) }
		  ${ removeFnNoise(gpuKernel._setupOutputTexture.toString()) }
		  ${ removeFnNoise(gpuKernel.detachTextureCache.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform1f.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform1i.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform2f.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform2fv.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform2iv.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform3fv.toString()) }
		  ${ removeFnNoise(gpuKernel.setUniform3iv.toString()) }
    };
    return kernelRunShortcut(new ${ name || 'Kernel' }());
  };`;
}

module.exports = {
	webGLKernelString
};