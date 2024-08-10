import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def log_info(msg):
    logging.info(msg)


def log_error(msg):
    logging.error(msg)
