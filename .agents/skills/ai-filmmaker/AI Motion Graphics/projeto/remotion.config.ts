import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
// Máquina com pouca memória: renderize com --concurrency=2 (ou baixe para 1).
